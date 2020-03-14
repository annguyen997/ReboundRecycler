from flask import Blueprint, request
from flask_cors import CORS, cross_origin
import json
from backend.mongo import *

#TODO - auth singleton?
class sessionManager:
    class sessionManagerInstance:
        def __init__(self):
            self.sessions = {}
        def getSessionManager(self):
            return self.sessions
        def makeSession(self, sessionToken, userID):
            if sessionToken not in self.sessions:
                self.sessions[sessionToken] = userID
                return True
            else:
                return False
        def getUserID(self, sessionToken):
            if sessionToken in self.sessions:
                return self.sessions[sessionToken]
            else:
                return None
        def goodSession(self, sessionToken):
            return sessionToken in self.sessions
    instance = None
    def __init__(self):
        if not sessionManager.instance:
            print("creating sessionManager singleton")
            sessionManager.instance = sessionManager.sessionManagerInstance()
        else:
            print("using existing sessionManager singleton")
    def getSessionManager(self):
        return self.instance.getSessionManager()
    def makeSession(self, sessionToken, userID):
        return self.instance.makeSession(sessionToken, userID)
    def getUserID(self, sessionToken):
        return self.instance.getUserID(sessionToken)
    def goodSession(self, sessionToken):
        return self.instance.goodSession(sessionToken)

sessions = {
}

auth = Blueprint('authentication', __name__)

###Special Getters###
@auth.route('/api/auth', methods = ['POST'])
@cross_origin()
def login():
    print("/api/auth hit")
    """Find and authenticate the user, give the user a bearer token"""
    if request.method == 'POST':
        print(request.json)
        username, password = request.json.get('username'), request.json.get('password')
        (userID, session) = authenticate(mongoClient('auth').getClient(), username, password)
        if session is not None and sessionManager().makeSession(session, userID):
            #sessions[session] = userID
            print("Successfully created session {}".format(session))
            return json.dumps({"token": str(session)})
        else:
            print("Authentication error")
            return json.dumps({}), 401
        print("No authentication header")
        return "", 404
    else:
        return "Bad method 405", 405
