from flask import Blueprint, request
import json
from utils import *

accounts = Blueprint('account', __name__)
@accounts.route('/api/account', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def accountCRUD():
    print('account')
    if request.method == 'GET':
        print('account get')
        session = request.headers.get('X-AUTH')
        (res, code) = req('get', '/api/account', headers = {'X-AUTH': session})
        if code is 200:
            print(json.dumps(res))
            return json.dumps(res), code
        else:
            return json.dumps({}), code
    elif request.method == 'POST':
        print('account create')
        body = {
            "username": request.json.get("username"),
            "password": request.json.get("password"),
            "name": request.json.get("name"),
            "email": request.json.get("email"),
        }

        (res, code) = req('post', '/api/account', body = body)
        if code is 200:
            print(json.dumps(res))
            return json.dumps(res), code
        else:
            return json.dumps({}), code
    elif request.method == 'PUT':
        print('account update')
        session = request.headers.get('X-AUTH')
        new_name = request.json.get('name')
        new_bio = request.json.get('bio')
        (res, code) = req('put', '/api/account', headers = {'X-AUTH': session}, body = {'name': new_name, 'bio': new_bio})
        print('account update result {}'.format(code))
        if code is 200:
            return json.dumps(res), code
        else:
            return json.dumps({}), code
    elif request.method == 'DELETE':
        return json.dumps({"err": "Unimplemented 501"}), 501
    else:
        return json.dumps({"err": "Bad method 405"}), 405

@accounts.route('/api/account/<username>/exists', methods = ['GET'])
def accountUsernameCRUD(username):
    """Say whether or not the username is taken"""
    if request.method == 'GET':
        sanitizedUsername = str(username.encode('utf-8').decode())
        (res, code) = req('get', '/api/account/{}/exists'.format(sanitizedUsername))
        return json.dumps(res), code
    else:
        return json.dumps({"err": "Bad method 405"}), 405

#TODO: make this /api/account/<username>/username PUT
'''
@app.route('/api/account/name', methods = ['POST'])
@cross_origin()
def accountNameCRUD():
    """Update (post) an account name, requires an authorization token"""
    if request.method == 'POST':
        session = request.headers.get('X-AUTH')
        if session is None or session not in sessions:
            return json.dumps({}), 403
        name = request.json.get('name')
        if name is None:
            return json.dumps({'err': 'no name given'}), 400
        uid = sessions[session]
        did_update = update_account_name(client, uid, name)
        return json.dumps({"msg": str(did_update)}), 200 if did_update else 500
    else:
        return json.dumps({"err": "Bad method 405"}), 405
'''

#TODO: make this /api/account/<username>/picture GET
# make a PUT method
@accounts.route('/api/account/picture/<u_id>', methods = ['GET'])
def getUserPicture(u_id):
    """Find a user picture given a supplied u_id"""
    sanitized_uid = str(u_id)
    (res, code) = req('get', '/api/account/picture/' + sanitized_uid)
    return res, code

#TODO: make this /api/account/<username>/thumbnail
# make a PUT method
@accounts.route('/api/account/thumbnail/<u_id>', methods = ['GET'])
def getUserThumbnail(u_id):
    """Find a user thumbnail given a supplied u_id"""
    sanitized_uid = str(u_id)
    (res, code) = req('get', '/api/account/thumbnail/' + sanitized_uid)
    return res, code