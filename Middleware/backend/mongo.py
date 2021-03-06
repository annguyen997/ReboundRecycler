#TODO: Singleton-ize me
#https://python-3-patterns-idioms-test.readthedocs.io/en/latest/Singleton.html
import time

import bson
from bson.json_util import loads, dumps
from bson.objectid import ObjectId

import pymongo
from pymongo import ReadPreference

import hashlib
import random
import string

def createMongoClient(url):
    client = pymongo.MongoClient(url)
    return client
#db = client.test

class mongoClient:
    class mongoClientInstance:
        def __init__(self, url):
            self.client = pymongo.MongoClient(url)
        def getClient(self):
            return self.client
    instance = None
    def __init__(self, url):
        if not mongoClient.instance:
            print("creating mongo singleton")
            print("url for mongo singleton: {}".format(url))
            mongoClient.instance = mongoClient.mongoClientInstance(url)
        else:
            print("using existing mongo singleton")
    def getClient(self):
        return self.instance.getClient()

def dbAction(action = None, args = None):
    with client.start_session() as sess:
        session.with_transaction(lambda s: action(s, args))

def authenticate(client = None, username = None, password = None):
    userID, session = None, None
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        user = readonly.find_one({"username": username}, session=sess)

        if user is not None:
            hasher = hashlib.sha256()
            hasher.update(user["pw_salt"].encode("utf-8"))
            hasher.update(password.encode("utf-8"))
            pw_hash = hasher.hexdigest()


            if user["pw_hash"] == pw_hash:
                session_hasher = hashlib.sha256()
                session_hasher.update(str(time.time()).encode("utf-8"))
                userID = str(user["_id"])
                session = session_hasher.hexdigest()
    return (userID, session)

#Create
def create_user(client = None, userData = {}):
    letters = string.ascii_lowercase
    pw_salt = ''.join(random.choice(letters) for i in range(8))
    
    hasher = hashlib.sha256()
    hasher.update(pw_salt.encode('utf-8'))
    hasher.update(userData['password'].encode('utf-8'))
    pw_hash = hasher.hexdigest()
    user = {
        "username": userData["username"], #sanitize
        "email": userData["email"], #sanitize
        "pw_hash": pw_hash,
        "pw_salt": pw_salt,
        "name": userData["name"], #sanitize
        "bio": userData["bio"], #sanitize
        "picture": userData["picture"], #sanitize
        "thumbnail": userData["thumbnail"] #sanitize
    }
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

def read_bounties_list(client = None):
    data = []
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        readonly = collection.with_options(
                read_preference=ReadPreference.SECONDARY)
        entries = readonly.find({}, session=sess)
        data = [{"_id": _["_id"], "name": _["name"], "price": _["price"], "state": _["state"], "desc": _["desc"], "img": _["img"]} for _ in entries]
    return dumps(data)

def read_bounties_map(client = None):
    data = []
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        entries = readonly.find({}, {"name": 1, "location": 1}, session=sess)
        data = list(entries)
    return dumps(data)

def read_userIDFromUsername(usernameEntered, client = None): 
    userID = None
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        user = readonly.find_one({"username": usernameEntered}, session=sess)
        userID = user["_id"]
    return dumps({"_id": userID})

def read_userFromSession(user_id, client = None): 
    user = None
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        #user = readonly.find_one({"_id": ObjectId(bountyID)}, session=sess)
        user = readonly.find_one({"_id": ObjectId(user_id)}, {"pw": 0, "picture": 0, "thumbnail": 0}, session=sess)
    return dumps(user)

def read_usernameFromDB(username, client):
    exists = False
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        user = readonly.find_one({"username": username}, {"_id": 0, "name": 0,"pw_hash": 0, "pw_salt": 0, "bio": 0, "picture": 0, "thumbnail": 0}, session=sess)
        print(user)
        if user != None:
            exists = True
    print(exists)
    return exists

def read_pictureFromUID(client = None, user_id = None):
    image_string = ""
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        #user = readonly.find_one({"_id": ObjectId(bountyID)}, session=sess)
        try:
            data = readonly.find_one({"_id": ObjectId(user_id)}, {"picture": 1}, session=sess)
            if data != None:
                image_string = data["picture"]
        except:
            image_string = ""
    return dumps(image_string)

def read_thumbnailFromUID(client = None, user_id = None):
    image_string = ""
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        #user = readonly.find_one({"_id": ObjectId(bountyID)}, session=sess)
        try:
            data = readonly.find_one({"_id": ObjectId(user_id)}, {"thumbnail": 1}, session=sess)
            if data != None:
                image_string = data["thumbnail"]
        except:
            image_string = ""
    return dumps(image_string)

#Update
def update_bounty_state(client = None, bounty_id = None, new_state = None):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.update_one({"_id": ObjectId(bounty_id)}, {"$set": {"state": new_state}}, session=sess)

def update_bounty(client = None, bounty_id = None, new_data = {}):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.update_one({"_id": ObjectId(bounty_id)}, {"$set": {"name" : new_data["name"], "price": new_data["price"], "state": new_data["state"], "desc" : new_data["desc"]}}, session=sess)

def update_account(client = None, account_id = None, new_name = None, new_bio = None):
    account_updates = {}
    if new_name != None:
        account_updates["name"] = new_name
    if new_bio != None:
        account_updates["bio"] = new_bio
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.user

        #TODO - harden this, make sure entry is SAFE
        collection.update_one({"_id": ObjectId(account_id)}, {"$set": account_updates}, session=sess)
    return True

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
