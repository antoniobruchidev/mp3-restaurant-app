import os
from flask import Flask # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from sqlalchemy.orm import DeclarativeBase # type: ignore

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

if os.path.exists("env.py"):
    import env


app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL")
db.init_app(app)

from kitchenmanager import routes #noqa
