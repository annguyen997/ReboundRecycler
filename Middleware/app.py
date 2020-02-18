import os
import json
from environment import *
from backend.mongo import * 
from flask import Flask, request
from flask_cors import CORS, cross_origin

"""Configuration"""
env = environment("app.env")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = createMongoClient(env.get_env("url").format(env.get_env("password")))

sessions = {
}

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


###Special Getters###
#@app.route('/api/auth', methods = ['GET', 'DELETE'])
@app.route('/api/auth', methods = ['GET'])
@cross_origin()
def login():
    print("/api/auth hit")
    """Find and authenticate the user, give the user a bearer token"""
    if request.method == 'GET':
        session = "None"
        if request.authorization:
            username = request.authorization['username']
            password = request.authorization['password']
            (userID, session) = authenticate(client, username, password)
            if session is not None:
                sessions[session] = userID
                print("Successfully created session {}".format(session))
                return json.dumps({"token": str(session)})
            else:
                print("Authentication error")
                return json.dumps({}), 403
        print("No authentication header")
        return "", 404
    else:
        return "Bad method 405", 405

@app.route('/api/auth/logout', methods = ['GET'])
@cross_origin()
def logout():    
    """Delete the sesion - Should be made a part of /api/auth as a DELETE method"""
    #if request.method == 'DELETE':
    if request.method == 'GET':
        session = request.headers.get('X-AUTH')
        if session != None and session in sessions:
            del sessions[session]
            #return json.dumps({"message":"session deleted"})
            print("Successfully deleted session {}".format(session))
            return "", 200
        else:
            print("Session {} does not exist - cannot delete".format(session))
            return "", 404
    else:
        return "Bad method 405", 405

@app.route('/api/bounties/map', methods = ['GET'])
@cross_origin()
def allBountiesCoordinates():
    """return bounty name, price, and coordinates"""
    print("get all bounty coordinates")
    data = read_bounties_map(client)

    #Filter results to return simply get _id, name, location to populate map. 
    #data = map(lambda entry : {"_id": entry['_id'], "name" : entry['name'], "location" : entry['location']}, data)
    return "{}".format(data)

@app.route('/api/bounties/listings', methods = ['GET'])
@cross_origin()
def allBountiesDetails():
    """return bounty name, description, price, and picture"""
    print("get all bounty details")
    data = read_bounties_list(client)

    return "{}".format(data)

@app.route('/api/bounty/add')
def createBounty(userID):
    if request.method == 'POST':
        new_bounty = {"name" : request.form["name"], "user_id" : userID, "location": {"lng": 0.0, "lat": 0.0}, "price" : request.form["price"], "state" : "untaken", "desc" : request.form["description"], "img" : None}
        create_bounty(client, new_bounty)

#CRUDs
@app.route('/api/jobs', methods=["POST"])
def createJob(userID, bountyID):
    if request.method == 'POST':
        new_job = {"user_id" : userID, "bounty_id" : bountyID, "state" : ""}
        create_job(client, new_job)

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
        #new_data = {"name" : request.form["name"], "price" : request.form["price"], "state" : request.form["state"], "desc" : request.form["description"]} #A multidict containing POST data
        #body = request.form
        update_bounty_state(client, bounty_id, "taken")
        return "true"

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

@app.route('/api/account', methods = ['GET', 'POST'])
@cross_origin()
def getUser():
    """Find a user_id given a supplied username"""
    if request.method == 'GET':
        print(request.headers)
        session = request.headers.get('X-AUTH')
        if session is None:
            return json.dumps({})
        uid = sessions[session]
        user = read_userFromSession(uid, client)
        print(user)
        return user
    elif request.method == "POST":
        """Make a new user account"""
        """This will require email verification before writing to the DB"""
        """pw_hash, pw_salt will be created here"""
        new_user = {"username" : request.form['username'], "pw" : request.form['pw'], "bio" : "", "picture" : None , "thumbnail": None}
        create_user(client, new_user)
    else:
        return "Bad method 405"

@app.route('/api/account/picture/<u_id>', methods = ['GET'])
@cross_origin()
def getUserPicture(u_id):
    """Find a user picture given a supplied u_id"""
    image_string = read_pictureFromUID(client, u_id)
    return image_string

@app.route('/api/account/thumbnail/<u_id>', methods = ['GET'])
@cross_origin()
def getUserThumbnail(u_id):
    """Find a user thumbnail given a supplied u_id"""
    image_string = read_thumbnailFromUID(client, u_id)
    return image_string

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))


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
