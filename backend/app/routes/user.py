# app/routes/user.py
from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from bson.errors import InvalidId

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/<user_id>', methods=["GET"])
def get_user(user_id):
    try:
        db = current_app.db
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])

            # most_played_game varsa, adını getir
            most_played_game_id = user.get('most_played_game')
            if most_played_game_id:
                game = db.games.find_one({"_id": ObjectId(most_played_game_id)})
                if game:
                    user['most_played_game_name'] = game['name']
                else:
                    user['most_played_game_name'] = None
            else:
                user['most_played_game_name'] = None

            # comment'ler varsa, sadece yorum metni ve oyun adıyla dön
            comments = user.get('comments', [])
            simplified_comments = []
            for c in comments:
                simplified_comments.append({
                    "game_name": c.get("game_name", "Bilinmeyen Oyun"),
                    "comment": c.get("comment", "")
                })
            user['comments'] = simplified_comments

            return jsonify(user)
        else:
            return jsonify({'error': 'User not found'}), 404
    except InvalidId:
        return jsonify({'error': 'Invalid user ID format'}), 400

@user_bp.route('/user/<user_id>/play', methods=['POST'])
def play_game(user_id):
    try:
        db = current_app.db
        data = request.get_json()
        
        # Validate game_id
        game_id = data.get('game_id')
        if not game_id:
            return jsonify({"error": "Game ID is required"}), 400
            
        play_time = data.get('play_time', 1)  # default 1 hour

        # Validate ObjectIds
        try:
            user_obj_id = ObjectId(user_id)
            game_obj_id = ObjectId(game_id)
        except InvalidId:
            return jsonify({"error": "Invalid user ID or game ID format"}), 400

        user = db.users.find_one({"_id": user_obj_id})
        game = db.games.find_one({"_id": game_obj_id})

        if not user or not game:
            return jsonify({"error": "User or Game not found"}), 404

        # Check if played_games is a list and convert it to dict if needed
        played_games = user.get("played_games", {})
        if isinstance(played_games, list):
            # Convert list to dictionary if it's a list
            played_games = {}

        # User played games güncellemesi
        played_games[str(game_id)] = played_games.get(str(game_id), 0) + play_time

        # Total play time arttır
        new_total_play_time = user.get('total_play_time', 0) + play_time

        # Most played game hesapla
        most_played_game = max(played_games, key=played_games.get) if played_games else None

        # User'ı güncelle
        db.users.update_one(
            {"_id": user_obj_id},
            {"$set": {
                "played_games": played_games,
                "total_play_time": new_total_play_time,
                "most_played_game": most_played_game
            }}
        )

        # Game play time arttır
        new_game_play_time = game.get('play_time', 0) + play_time
        db.games.update_one(
            {"_id": game_obj_id},
            {"$set": {"play_time": new_game_play_time}}
        )

        return jsonify({"message": "Game played successfully."})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@user_bp.route('/user/<user_id>/rate', methods=['POST'])
def rate_game(user_id):
    try:
        db = current_app.db
        data = request.get_json()
        
        # Validate game_id
        game_id = data.get('game_id')
        if not game_id:
            return jsonify({"error": "Game ID is required"}), 400
            
        rating = data.get('rating')
        if rating is None:
            return jsonify({"error": "Rating is required"}), 400

        if not (1 <= rating <= 5):
            return jsonify({"error": "Rating must be between 1 and 5"}), 400

        # Validate ObjectIds
        try:
            user_obj_id = ObjectId(user_id)
            game_obj_id = ObjectId(game_id)
        except InvalidId:
            return jsonify({"error": "Invalid user ID or game ID format"}), 400

        user = db.users.find_one({"_id": user_obj_id})
        game = db.games.find_one({"_id": game_obj_id})

        if not user or not game:
            return jsonify({"error": "User or Game not found"}), 404

        if not game.get("is_rating_enabled", True):
            return jsonify({"error": "Rating is disabled for this game"}), 403

        # Check if played_games is a list and convert it to dict if needed
        played_games = user.get("played_games", {})
        if isinstance(played_games, list):
            # Convert list to dictionary if it's a list
            played_games = {}
            # Update the user with the correct format
            db.users.update_one(
                {"_id": user_obj_id},
                {"$set": {"played_games": played_games}}
            )
            return jsonify({"error": "User data format updated. Please try rating again."}), 400

        if str(game_id) not in played_games or played_games[str(game_id)] < 1:
            return jsonify({"error": "User must play at least 1 hour before rating"}), 403

        user_playtime = played_games[str(game_id)]
        
        all_ratings = []
        for u in db.users.find():
            u_played_games = u.get("played_games", {})
            if isinstance(u_played_games, dict) and str(game_id) in u_played_games:
                if u.get("average_rating") is not None:
                    all_ratings.append((u_played_games[str(game_id)], u["average_rating"]))

        all_ratings.append((user_playtime, rating))  # yeni rating eklendi

        numerator = sum(playtime * r for playtime, r in all_ratings)
        denominator = sum(playtime for playtime, r in all_ratings)

        new_rating = numerator / denominator if denominator != 0 else None

        db.games.update_one(
            {"_id": game_obj_id},
            {"$set": {"rating": new_rating}}
        )
        
        comments_and_ratings = []
        for g_id in played_games:
            try:
                g_obj_id = ObjectId(g_id)
                game_data = db.games.find_one({"_id": g_obj_id})
                if game_data and game_data.get("rating"):
                    comments_and_ratings.append(game_data["rating"])
            except InvalidId:
                continue  # Skip invalid IDs

        new_avg_rating = sum(comments_and_ratings) / len(comments_and_ratings) if comments_and_ratings else None

        db.users.update_one(
            {"_id": user_obj_id},
            {"$set": {"average_rating": new_avg_rating}}
        )

        return jsonify({"message": "Rating submitted successfully."})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@user_bp.route('/user/<user_id>/comment', methods=['POST'])
def comment_game(user_id):
    try:
        db = current_app.db
        data = request.get_json()
        
        # Validate game_id and comment
        game_id = data.get('game_id')
        if not game_id:
            return jsonify({"error": "Game ID is required"}), 400
            
        comment_text = data.get('comment')
        if not comment_text:
            return jsonify({"error": "Comment text is required"}), 400

        # Validate ObjectIds
        try:
            user_obj_id = ObjectId(user_id)
            game_obj_id = ObjectId(game_id)
        except InvalidId:
            return jsonify({"error": "Invalid user ID or game ID format"}), 400

        user = db.users.find_one({"_id": user_obj_id})
        game = db.games.find_one({"_id": game_obj_id})

        if not user or not game:
            return jsonify({"error": "User or Game not found"}), 404

        # Check if commenting is enabled - UPDATED
        is_commenting_enabled = game.get("is_comment_enabled", True)
        if not is_commenting_enabled:
            return jsonify({"error": "Commenting is disabled for this game"}), 403

        # Check if played_games is a list and convert it to dict if needed
        played_games = user.get("played_games", {})
        if isinstance(played_games, list):
            # Convert list to dictionary if it's a list
            played_games = {}
            # Update the user with the correct format
            db.users.update_one(
                {"_id": user_obj_id},
                {"$set": {"played_games": played_games}}
            )
            return jsonify({"error": "User data format updated. Please try commenting again."}), 400

        if str(game_id) not in played_games or played_games[str(game_id)] < 1:
            return jsonify({"error": "User must play at least 1 hour before commenting"}), 403

        # User tarafına comment ekle
        db.users.update_one(
            {"_id": user_obj_id},
            {"$push": {"comments": {
                "game_id": str(game_id),
                "game_name": game['name'],
                "comment": comment_text
            }}}
        )

        # Game tarafına comment ekle
        db.games.update_one(
            {"_id": game_obj_id},
            {"$push": {"all_comments": {
                "user_id": str(user_id),
                "user_name": user['name'],
                "comment": comment_text,
                "play_time": played_games[str(game_id)]
            }}}
        )

        return jsonify({"message": "Comment added successfully."})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@user_bp.route('/games', methods=['GET'])
def get_all_games():
    try:
        db = current_app.db
        games = list(db.games.find())
        for game in games:
            game['_id'] = str(game['_id'])
        return jsonify(games)
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500