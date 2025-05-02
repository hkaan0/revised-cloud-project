from pymongo import MongoClient
import random

# MongoDB bağlantı ayarları
MONGO_URI = "mongodb+srv://master:123456789aA@database.xkjcpfu.mongodb.net/"
MONGO_DBNAME = "database"

# MongoDB bağlantısı oluştur
client = MongoClient(MONGO_URI)
db = client[MONGO_DBNAME]

# Koleksiyonlar
users_collection = db["users"]
games_collection = db["games"]

# Var olan verileri temizle 
users_collection.delete_many({})
games_collection.delete_many({})

# Kullanıcı isimleri
user_names = [
    "Alice", "Bob", "Charlie", "David", "Eva",
    "Frank", "Grace", "Hannah", "Ivan", "Julia"
]

# 10 Kullanıcı oluştur
users = []
for name in user_names:
    user = {
        "name": name,
        "total_play_time": 0,
        "average_rating": 0.0,
        "most_played_game": None,
        "comments": [],
        "played_games": []
    }
    users.append(user)

# Kullanıcıları ekle
users_collection.insert_many(users)

# Oyun isimleri ve türleri
game_names = [
    "Space Odyssey", "Pirate Adventure", "Mystery Island", "Dragon Quest", "Super Racer",
    "Battle Royale", "Zombie Land", "Fantasy World", "Sky Kingdom", "City Builder"
]

genres_list = [
    ["Action", "Adventure"],
    ["Strategy", "Puzzle"],
    ["RPG"],
    ["Shooter", "Survival"],
    ["Racing"],
    ["Battle Royale", "Multiplayer"],
    ["Horror", "Action"],
    ["Fantasy", "MMORPG"],
    ["Simulation", "Adventure"],
    ["Building", "Management"]
]

# Fotoğraf linkleri
photos = [
    "https://via.placeholder.com/150?text=Space+Odyssey",
    "https://via.placeholder.com/150?text=Pirate+Adventure",
    "https://via.placeholder.com/150?text=Mystery+Island",
    "https://via.placeholder.com/150?text=Dragon+Quest",
    "https://via.placeholder.com/150?text=Super+Racer",
    "https://via.placeholder.com/150?text=Battle+Royale",
    "https://via.placeholder.com/150?text=Zombie+Land",
    "https://via.placeholder.com/150?text=Fantasy+World",
    "https://via.placeholder.com/150?text=Sky+Kingdom",
    "https://via.placeholder.com/150?text=City+Builder"
]

# 10 Oyun oluştur
games = []
for i in range(10):
    game = {
        "name": game_names[i],
        "genres": genres_list[i],
        "photo": photos[i],
        "play_time": 0,
        "rating": 0.0,
        "all_comments": [],
        "is_comment_rating_enabled": True,
    }
    if i % 3 == 0:  # Her 3 oyunda 1 opsiyonel alanlar ekle
        game["optional_fields"] = {
            "release_date": f"202{random.randint(0, 4)}-0{random.randint(1,9)}-{random.randint(10,28)}",
            "developer": f"DevStudio {i}",
            "requirements": f"{random.randint(8,32)}GB RAM, GTX {random.randint(1050,3080)}"
        }
    games.append(game)

# Oyunları ekle
games_collection.insert_many(games)

print("✅ Database initialization completed successfully!")
