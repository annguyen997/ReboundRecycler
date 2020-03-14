#Packages
from flask import Flask, render_template, request
import requests
import json

#Support files
from endpoints.auth import auth
from endpoints.accounts import accounts
from endpoints.bounties import bounties
from utils import *

app = Flask(__name__, static_folder="../build/static", template_folder="../build")

#Development only
from flask_cors import CORS, cross_origin
CORS(app, resources = {r"/api/*": {"origins": ["http://cookie:3000", "http://192.168.1.242:3000", "http://localhost:3000"]}})

#Front-End Routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route('/listings')
def listings():
    return render_template("index.html")

@app.route("/account")
def account():
    return render_template("index.html")

@app.route("/logout")
def logout():
    return render_template("index.html")

###API routes###
app.register_blueprint(auth)
app.register_blueprint(accounts)
app.register_blueprint(bounties)

##Test Routes##
@app.route('/api/test/front')
def front_end_test():
    return json.dumps({'msg': 'return from front-end server'}), 200

@app.route('/api/test/back')
def back_end_test():
    return json.dumps(data), 200

if __name__ == "__main__":
    app.run(debug = True, host = '0.0.0.0', threaded = True)
