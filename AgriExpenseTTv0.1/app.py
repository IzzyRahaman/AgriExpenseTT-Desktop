from flask import Flask, render_template, redirect, abort , url_for
from bson import json_util
from flask_triangle import Triangle
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import persistence_manager as persist
import os

# If you get an error on the next line on Python 3.4.0, change to: Flask('app')
# where app matches the name of this file without the .py extension.

# Set up the application
app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/mydb"
Triangle(app)
mongo = PyMongo(app)

inserted_base_resources = True

from routes import *

# Make the WSGI interface available at the top level so wfastcgi can get it.
wsgi_app = app

if __name__ == '__main__':
    
    
    #host = os.environ.get('SERVER_HOST', 'localhost')
    try:
        port = int(os.environ.get('PORT', '5555'))
    except ValueError:
        port = 5555
    app.run('127.0.0.1', port,debug=True)
