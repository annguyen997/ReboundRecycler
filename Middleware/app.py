import os
import json
from backend.mongo import *
from flask import Flask
from flask_cors import CORS, cross_origin

"""Configuration"""
app = Flask(__name__)
#cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

CORS(app)
client = createMongoClient()

"""MAIN"""
@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        task_content = request.form['content'] #POST body
        return ""
        """
        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue loading your task to the application'
        """
    elif request.method == 'GET': #Render the page. 
        """
        data = read_bounties(client) 
        return render_template('index.html', data=data)
        """
        return "Homepage TODO"
    else:
        return None

@app.route('/api/auth', methods = ['POST'])
def login():
    """Find a user_id given a supplied username"""
    if request.method == 'POST':
        username = request.form['username']
        userID = read_userIDFromUsername(username, client)
        return userID
    else:
        return "Bad method 405"

@app.route('/api/bounties/map', methods = ['GET'])
@cross_origin()
def allBountiesCoordinates():
    """return bounty name, price, and coordinates"""
    print("get all bounty coordinates")
    data = read_bounties(client)

    #Filter results to return simply get _id, name, location to populate map. 
    #data = map(lambda entry : {"_id": entry['_id'], "name" : entry['name'], "location" : entry['location']}, data)
    return "{}".format(data)

@app.route('/api/bounty/<bounty_id>', methods = ['GET', 'POST', 'DELETE'])
def bountyCRUD(bounty_id):
    if request.method == 'GET':
        """Return the information for <bounty_id>"""
        bountyInfo = read_bounty(bounty_id, client) 
        return bountyInfo; 

    if request.method == 'POST':
        """modify/update the information for <bounty_id>"""
        # you can use <user_id>, which is a str but could
        # changed to be int or whatever you want, along
        # with your lxml knowledge to make the required
        # changes

        #DO NOT CHANGE _id, user_id, location
        new_data = {"name" : request.form["name"], "price" : request.form["price"], "state" : request.form["state"], "desc" : request.form["description"]} #A multidict containing POST data
        update_bounty(client, bounty_id, new_data)

    if request.method == 'DELETE':
        """delete bounty with ID <bounty_id>, given that <bounty_id> belongs to <user_id>"""
        #On the form or some source when DELETE is requested
        userID = request.form["user_id"]
        bountyID = request.form["bounty_id"]
    
        did_delete = delete_bounty(client, bountyID, userID)
        return did_delete
    else:
        return "Unimplemented. There is a problem understanding the request."
        # POST Error 405 Method Not Allowed
        
if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
    #app.run(debug=True,host='localhost',port=int(os.environ.get('PORT', 8080)))


#OLD MAIN FOR REFERENCE PURPOSES
"""
@app.route('/', methods=['POST', 'GET']) #URL route string of the app 
def hello_world():

    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Todo(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue adding your task'

    else: #Render the page. 
        tasks = Todo.query.order_by(Todo.date_created).all()
        #target = os.environ.get('TARGET', 'World')
        #return 'Hello {}!\n'.format(target)
        return render_template('index.html', tasks=tasks)

@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)
    
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return "There was a problem deleting that task."

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task.'
    else:
        return render_template('update.html', task=task)
"""
