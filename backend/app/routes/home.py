from flask import Blueprint, request, jsonify, current_app
from app.models import Game, User
from bson.objectid import ObjectId

home_bp = Blueprint('home', __name__)

@home_bp.route('/', methods=['GET'])
def root():
    return jsonify({"message": "API running"}), 200


@home_bp.route('/api/home', methods=['GET'])
def get_home_data():
    db = current_app.db
    users = list(db.users.find())
    games = list(db.games.find())

    # Game sözlüğü oluştur: {str(game_id): game_name}
    game_dict = {str(game["_id"]): game["name"] for game in games}

    # Kullanıcılara most_played_game_name alanını ekle
    for user in users:
        user['_id'] = str(user['_id'])
        most_played_game_id = str(user.get('most_played_game', ''))
        user['most_played_game'] = most_played_game_id  # objectid string'e çevrildi
        user['most_played_game_name'] = game_dict.get(most_played_game_id, None)

    # Game id'lerini de stringle
    for game in games:
        game['_id'] = str(game['_id'])

    return jsonify({"users": users, "games": games})


@home_bp.route('/api/add_user', methods=['POST'])
def add_user():
    db = current_app.db
    data = request.get_json()  # JSON olarak gelen veriyi al
    name = data.get('name')
    if name:
        new_user = User(name)
        db.users.insert_one(new_user.to_dict())
        return jsonify({"message": "User added successfully"}), 201
    return jsonify({"error": "Name is required"}), 400

@home_bp.route('/api/remove_user/<user_id>', methods=['DELETE'])
def remove_user(user_id):
    db = current_app.db
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "User removed successfully"})
    return jsonify({"error": "User not found"}), 404

@home_bp.route('/api/add_game', methods=['POST'])
def add_game():
    db = current_app.db
    data = request.get_json()
    name = data.get('name')
    genres = data.get('genres')
    photo = data.get('photo')
    optional_fields = data.get('optional_fields', {})

    if name and genres and photo:
        new_game = Game(name, genres, photo, optional_fields)
        db.games.insert_one(new_game.to_dict())
        return jsonify({"message": "Game added successfully"}), 201
    return jsonify({"error": "Name, genres, and photo are required"}), 400

@home_bp.route('/api/remove_game/<game_id>', methods=['DELETE'])
def remove_game(game_id):
    db = current_app.db
    result = db.games.delete_one({"_id": ObjectId(game_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Game removed successfully"})
    return jsonify({"error": "Game not found"}), 404

@home_bp.route('/api/disable_rating/<game_id>', methods=['PUT'])
def disable_rating(game_id):
    db = current_app.db
    result = db.games.update_one(
        {"_id": ObjectId(game_id)},
        {"$set": {"is_rating_enabled": False}}
    )
    if result.modified_count > 0:
        return jsonify({"message": "Rating disabled successfully"})
    return jsonify({"error": "Game not found"}), 404

@home_bp.route('/api/enable_rating/<game_id>', methods=['PUT'])
def enable_rating(game_id):
    db = current_app.db
    result = db.games.update_one(
        {"_id": ObjectId(game_id)},
        {"$set": {"is_rating_enabled": True}}
    )
    if result.modified_count > 0:
        return jsonify({"message": "Rating enabled successfully"})
    return jsonify({"error": "Game not found"}), 404

# Yeni eklenen yorum özelliğini kapatma ve açma fonksiyonları
@home_bp.route('/api/disable_comment/<game_id>', methods=['PUT'])
def disable_comment(game_id):
    db = current_app.db
    result = db.games.update_one(
        {"_id": ObjectId(game_id)},
        {"$set": {"is_comment_enabled": False}}
    )
    if result.modified_count > 0:
        return jsonify({"message": "Commenting disabled successfully"})
    return jsonify({"error": "Game not found"}), 404

@home_bp.route('/api/enable_comment/<game_id>', methods=['PUT'])
def enable_comment(game_id):
    db = current_app.db
    result = db.games.update_one(
        {"_id": ObjectId(game_id)},
        {"$set": {"is_comment_enabled": True}}
    )
    if result.modified_count > 0:
        return jsonify({"message": "Commenting enabled successfully"})
    return jsonify({"error": "Game not found"}), 404