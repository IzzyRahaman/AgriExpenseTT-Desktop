import uuid
import hashlib


from app import mongo


nonspecific_user_id = -1

def hash_password(password):
    # uuid is used to generate a random number
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt
    
def check_password(hashed_password, user_password):
    password, salt = hashed_password.split(':')
    return password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()



def insert_user(first_name, last_name, location, password):
    user = {}
    user['firstName'] = first_name
    user['lastName'] = last_name
    user['location'] = location
    user['password'] = hash_password(password)

    # Insert the user object into the mongo db database
    mongo.db.users.insert(user)

def retrieve_users(first_name, last_name, password):
    users = []
    user_query = {}
    user_query['firstName'] = first_name
    user_query['lastName'] = last_name
    user_query['password'] = hash_password(password)
    users = mongo.db.users.find(user_query)
    return users

def retrieve_resource_types():
    resource_types = []
    resource_types = mongo.db.resources.distinct("type")
    if "labour" not in resource_types:
        resource_types.append("labour")
    if "other" not in resource_types:
        resource_types.append("other")
    return resource_types




def insert_resource(user_id, resource_name, resource_type):
    resource = {}
    resource['userId'] = user_id
    resource['resourceType'] = resource_type
    resource['resourceName'] = resource_name
    mongo.db.resources.insert(resource)

def edit_resource(resource_id, resource_name, resource_type):
    setter = {"$set": {"resourceName" : resource_name, "resourceType" : resource_type}}
    mongo.db.resources.update({'_id' : resource_id}, setter)


def retrieve_all_user_specific_resources(user_id):
    resources = []
    resource_query = {'userId': user_id}
    resources = mongo.db.resources.find(resource_query)
    return resources




def retrieive_all_nonspecific_resources():
    return retrieve_all_user_specific_resources(nonspecific_user_id)


def insert_purchase(user_id, resource_name, date, resource_type, quantifier, qty, qty_remaining, cost):
    purchase = {'userId' : user_id, 'resourceName' : resource_name}
    purchase.update({'quantifier' : quantifier, 'qtyRemaining' : qty_remaining, 'cost' : cost})
    purchase.update({'qty' : qty, 'date': date, 'resourceType' : resource_type})
    print 'Logging'
    print purchase
    mongo.db.purchases.insert(purchase)
    return purchase

def retrieve_resources(user_id):
    resources = retrieive_all_nonspecific_resources()
    resources.extend(retrieve_all_user_specific_resources(user_id))
    return resources






def retrieve_purchases_by_user(user_id):
    purchases = []
    purchases = mongo.db.purchases.find({'userId': user_id})
    return purchases

def insert_cycle(user_id, crop, land_quantifier, land_qty, date):
    cycle = {'landQty' : land_qty, 'landQuantifier' : land_quantifier, 'date' : date, 'crop' : crop, 'userId' : user_id}
    mongo.db.cycles.insert(cycle)
    return cycle

def retrieve_cycles_by_user(user_id):
    cycles = []
    cycles = mongo.db.cycles.find({'userId' : user_id})
    print cycles
    return cycles

def insert_cycle_use(user_id, cycle_id, purchase_id, quantifier, amt_used, cost_of_use,
                     resource_type, date):
    use = {'userId' : user_id, 'cycleId': cycle_id, 'purchaseId' : purchase_id, 'quantifier' : quantifier}
    use.update({'amountUsed' : amt_used, 'costOfUse' : cost_of_use, 'resourceType' : resource_type})
    use.update({'date': date})
    mongo.db.uses.insert(use)

def retrieve_uses_by_user(user_id):
    uses = []
    uses = mongo.db.uses.find({'userId' : user_id})
    return uses






