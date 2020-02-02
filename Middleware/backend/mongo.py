import bson
from bson.objectid import ObjectId

import pymongo
from pymongo import ReadPreference

def createMongoClient():
    client = pymongo.MongoClient("mongodb+srv://root:toor@rebound-hjaic.gcp.mongodb.net/test?retryWrites=true&w=majority")
    return client
#db = client.test

def dbAction(action = None, args = None):
    with client.start_session() as sess:
        session.with_transaction(
                lambda s: action(s, args))

#C
def create_bounty(client = None, bounty = None):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.insert_one(bounty, session=sess)

#R
def read_bounties(client = None):
    data = []
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        readonly = collection.with_options(
            read_preference=ReadPreference.SECONDARY)
        entries = readonly.find({}, session=sess)
        for entry in entries:
            data.append([entry])
            #print("({}) {:10}\t${}\t{}\t\t{:20}".format(
            #    entry["_id"], entry["name"], entry["price"], entry["state"], entry["desc"]))
    return data

#U
def update_bounty_state(client = None, bounty_id = None, new_state = None):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.update_one({"_id": ObjectId(bounty_id)}, {"$set": {"state": new_state}}, session=sess)

#D
def delete_bounty(client = None, bounty_id = None):
    with client.start_session(causal_consistency=True) as sess:
        collection = client.rebound.bounty
        collection.delete_one({"_id": ObjectId(bounty_id)}, session=sess)

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