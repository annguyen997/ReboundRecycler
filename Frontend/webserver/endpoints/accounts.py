from flask import Blueprint, request
import json
from utils import *

accounts = Blueprint('account', __name__)
@accounts.route('/api/account', methods = ['GET', 'POST', 'UPDATE', 'DELETE'])
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
    else:
        return json.dumps({"err": "Bad method 405"}), 405

#TODO: make this /api/account/<username>/username GET
@accounts.route('/api/account/username/<username>', methods = ['GET'])
def accountUsernameCRUD(username):
    """Say whether or not the username is taken"""
    if request.method == 'GET':
        sanitizedUsername = username.encode('utf-8')
        (res, code) = req('get', '/api/account/' + sanitizedUsername)
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