from flask import Blueprint, request
import json
from utils import *

bounties = Blueprint('bounties', __name__)
@bounties.route('/api/bounties/map', methods = ['GET'])
def allBountiesCoordinates():
    """return bounty name, price, and coordinates"""
    
    (res, code) = req('get', '/api/bounties/map')

    if code is 200 and res is not {}:
        return json.dumps(res), 200
    else:
        return json.dumps({}), 500

@bounties.route('/api/bounties/listings', methods = ['GET'])
def allBountiesDetails():
    """return bounty name, price, and coordinates"""
    
    (res, code) = req('get', '/api/bounties/listings')
    
    #if code is 200 and res is not {}:
    #    return json.dumps(res), 200
    #else:
    #    return json.dumps({}), 500
    return json.dumps(res), code

@bounties.route('/api/bounty/<bid>', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def bountyCRUD(bid):
    if request.method == 'GET':
        print('GET api/bounty/{}'.format(bid))
        _bid = bid
        (res, code) = req('get', '/api/bounty/{}'.format(_bid))
        print(res)
        return json.dumps(res), code
    else:
        return json.dumps({}), 501
