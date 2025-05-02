from flask import Flask
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS

import os
def create_app():
    
    app = Flask(__name__)
    CORS(app, origins="http://localhost:5173")
    load_dotenv()
    
    mongo_uri = os.getenv('MONGO_URI')
    

    client = MongoClient(mongo_uri)
    app.db = client["database"]  # burası env'den dinamik çekilecek

    from app.routes.home import home_bp
    from app.routes.user import user_bp
    from app.routes.game import game_bp

    app.register_blueprint(home_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(game_bp)

    return app
