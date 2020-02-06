import bson
from bson.json_util import loads, dumps
from bson.objectid import ObjectId

import pymongo
from pymongo import ReadPreference

def createMongoClient(url):
    client = pymongo.MongoClient(url)
    return client
#db = client.test

def dbAction(action = None, args = None):
    with client.start_session() as sess:
        session.with_transaction(lambda s: action(s, args))

#Create
def create_user(client = None, user = {}):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        collection.insert_one(user, session=sess)

def create_bounty(client = None, bounty = {}):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.insert_one(bounty, session=sess)

def create_job(client = None, job = {}):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.job
        collection.insert_one(job, session=sess)

#Read
def read_bounty(bountyID, client = None):
    bountyEntry = None
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        bountyEntry = readonly.find_one({"_id": ObjectId(bountyID)}, session=sess)
    return dumps(bountyEntry)

def read_bounties(client = None):
    data = []
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        entries = readonly.find({}, session=sess)
        data = [{"_id": _["_id"], "name": _["name"], "location": _["location"]} for _ in entries]
    return dumps(data)

def read_userIDFromUsername(usernameEntered, client = None): 
    userID = None
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.users
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        user = readonly.find_one({"username": usernameEntered}, session=sess)
        userID = user["_id"]
    return dumps({"_id": userID})

#Update
def update_bounty_state(client = None, bounty_id = None, new_state = None):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.update_one({"_id": ObjectId(bounty_id)}, {"$set": {"state": new_state}}, session=sess)

def update_bounty(client = None, bounty_id = None, new_data = {}):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.update_one({"_id": ObjectId(bounty_id)}, {"$set": {"name" : new_data["name"], "price": new_data["price"], "state": new_data["state"], "desc" : new_data["desc"]}}, session=sess)

#Delete
def delete_bounty(client = None, bounty_id = None, user_id = None):
    success = False
    #TODO: Check if the user actually owns this bounty!!!
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        #entry = collection.find_one({"_id": ObjectId(bounty_id)}, session=sess)
        #if entry["user_id"] == user_id:
        #   ... not implemented cause entries don't currenly store user ids, whoops!
        #   collection.delete_one({"_id": ObjectId(bounty_id)}, session=sess)
        collection.delete_one({"_id": ObjectId(bounty_id)}, session=sess)
        success = True
    return success

#inventory.update_one({"sku": "abc123", "qty": {"$gte": 100}},{"$inc": {"qty": -100}}, session=session)

#{ _id: { $in: [ 5, ObjectId("507c35dd8fada716c89d0013") ] } }
#db.bios.find( { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } } )

test_bounty = {
    "name": "Trash in Rosslyn",
    "desc": "Can someone dispose of the Raytheon building? Thanks...",
    "user_id": None,
    "location":{
        "lng":0.0,
        "lat":0.0
    },
    "price": 99999.99,
    "state": "untaken",
    "img": None
}
