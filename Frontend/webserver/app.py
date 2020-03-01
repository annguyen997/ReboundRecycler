import requests
import json
from flask import Flask, render_template

backend_uri = 'http://localhost:8080'

def req(method, endpoint, headers = None, params = None, json = None):
    url = backend_uri + endpoint
    if method is 'get':
        res = requests.get(url = url, params = params)
    elif method is 'post':
        res = requests.post(url = url, params = params, json = json)
    else:
        res = {}
    
    if res.code == 200
        data = res.json()
    return data

app = Flask(__name__, static_folder="../build/static", template_folder="../build")

#Front-End Routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/account")
def account():
    return render_template("index.html")

@app.route("/hello")
def hello():
    return "Hello World!"

###API routes###
@app.route('/api/bounties/map', methods = ['GET'])
@cross_origin()
def allBountiesCoordinates():
    """return bounty name, price, and coordinates"""
    print("get all bounty coordinates")
    data = read_bounties_map(client)

    #Filter results to return simply get _id, name, location to populate map. 
    #data = map(lambda entry : {"_id": entry['_id'], "name" : entry['name'], "location" : entry['location']}, data)
    return "{}".format(data)

##Tests##
@app.route('/api/test/front')
def front_end_test():
    return json.dumps({'msg': 'return from front-end server'}), 200

@app.route('/api/test/back')
def back_end_test():
    
    return json.dumps(data), 200

if __name__ == "__main__":
    app.run()