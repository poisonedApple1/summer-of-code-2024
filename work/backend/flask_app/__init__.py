from flask import Flask
from flask_app.modules import hello,goodbye
from flask_app.config import Config

def create_app():
    app=Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY="amandegala"
    )
    app.register_blueprint(hello.blueprint)
    app.register_blueprint(goodbye.blueprint)

    return app;