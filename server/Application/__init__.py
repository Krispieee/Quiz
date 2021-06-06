from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_mail import Mail
import os
from flask_jwt_extended import JWTManager

#configurations
app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True
app.config['JWT_SECRET_KEY'] = 'super-secret'

#database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///'+os.path.join(basedir,'database.db')

# configuration of mail 
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465  
app.config['MAIL_USERNAME'] = 'ques.zillion@gmail.com'
app.config['MAIL_PASSWORD'] = 'Kesavan@ques'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

app.config["CLIENT_CSV"] = os.getcwd()+'\\Application\\static\\reports'

#instantiations
db=SQLAlchemy(app)
ma=Marshmallow(app)
jwt=JWTManager(app)
mail = Mail(app) 

from Application import routes

