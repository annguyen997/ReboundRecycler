from flask import Blueprint, request
import json
from utils import *

auth = Blueprint('authentication', __name__)
@auth.route('/api/auth', methods = ['POST', 'DELETE'])
def authenticationCRUD():
    print("/api/auth hit")
    """Find and authenticate the user, give the user a bearer token"""
    if request.method == 'POST':
        if request.authorization:
            username = request.authorization['username']
            password = request.authorization['password']
            print(json.dumps({'username': username, 'password': password}))
            (res, code) = req('post', '/api/auth', body = {'username': username, 'password': password})
            if code is 200:
                return json.dumps(res), code
            else: 
                return json.dumps({}), 401
    elif request.method == 'DELETE':
        session = request.headers.get('X-AUTH')
        (res, code) = req('delete', '/api/auth', headers = {'X-AUTH': session})
        return json.dumps({}), code
    else:
        return "Bad method 405", 405