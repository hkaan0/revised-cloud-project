from datetime import datetime

class User:
    def __init__(self, name):
        self.name = name
        self.total_play_time = 0
        self.average_rating = None
        self.most_played_game = None
        self.comments = []
        self.played_games = {}  # game_id -> playtime

    def to_dict(self):
        return {
            "name": self.name,
            "total_play_time": self.total_play_time,
            "average_rating": self.average_rating,
            "most_played_game": self.most_played_game,
            "comments": self.comments,
            "played_games": self.played_games
        }

class Game:
    def __init__(self, name, genres, photo, optional_fields=None):
        self.name = name
        self.genres = genres
        self.photo = photo
        self.optional_fields = optional_fields if optional_fields else {}
        self.play_time = 0
        self.rating = None
        self.all_comments = []
        self.is_rating_enabled = True
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "name": self.name,
            "genres": self.genres,
            "photo": self.photo,
            "optional_fields": self.optional_fields,
            "play_time": self.play_time,
            "rating": self.rating,
            "all_comments": self.all_comments,
            "is_rating_enabled": self.is_rating_enabled,
            "created_at": self.created_at
        }
