from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId

game_bp = Blueprint('game', __name__)

@game_bp.route('/game/<game_id>', methods=['GET'])
def get_game(game_id):
    db = current_app.db
    game = db.games.find_one({"_id": ObjectId(game_id)})
    if game:
        game["_id"] = str(game["_id"])
        return jsonify(game)
    else:
        return jsonify({"error": "Game not found"}), 404

@game_bp.route('/games', methods=['GET'])
def get_games():
    db = current_app.db
    games = list(db.games.find())
    for game in games:
        game['_id'] = str(game['_id']) 
    return jsonify(games) 
