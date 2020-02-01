import os
from backend.mongo import *
from flask import Flask

app = Flask(__name__)
client = createMongoClient()

@app.route('/')
def hello_world():
	target = os.environ.get('TARGET', 'World')
	return 'Hi {}!\n'.format(target)

@app.route('/api/auth', methods = ['POST'])
def login():
    """Find a user_id, given a username"""
    if request.method == 'POST':
        data = request.form
        return "no user found"
    else:
        return "bad method 405"

@app.route('/api/bounties/map', methods = ['GET'])
def allBountiesCoords():
    """return bounty name, price, and coordinates"""
    print("get all bounty coordinates")
    data = read_bounties(client)
    return "{}".format(data)

@app.route('/api/bounty/<bounty_id>', methods = ['GET', 'POST', 'DELETE'])
def bountyCRUD(bounty_id):
    if request.method == 'GET':
        """return the information for <bounty_id>"""
    if request.method == 'POST':
        """modify/update the information for <bounty_id>"""
        # you can use <user_id>, which is a str but could
        # changed to be int or whatever you want, along
        # with your lxml knowledge to make the required
        # changes
        data = request.form # a multidict containing POST data
        return "unimplemented"
    if request.method == 'DELETE':
        """delete bounty with ID <bounty_id>, given that <bounty_id> belongs to <user_id>"""
        return "unimplemented"
    else:
        return "unimplemented"
        # POST Error 405 Method Not Allowed

if __name__ == "__main__":
        
	app.run(debug=True,host='localhost',port=int(os.environ.get('PORT', 8080)))
