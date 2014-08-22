from bson import json_util
from datetime import datetime
from flask import render_template, url_for, redirect, request
from app import app

import persistence_manager as persist

#---------------------- ROUTES FOR DISPLAYING WEB PAGES ---------------------------------------

@app.route('/app')
def application():
    return render_template("app.html")

@app.route('/')
@app.route('/home')
def home():
    return render_template(
        'index.html',
        title = 'Home Page',
        year = datetime.now().year,
    )

@app.route("/landing")
def landing():
    return render_template("login.html")

@app.route("/registration")
def registration():
    counties = ['Caroni', 'Mayaro', 'Nariva', 'Saint Andrew', 'Saint David',
                'Saint George', 'Saint Patrick', 'Victoria']
    return render_template("registration.html")

@app.route('/contact')
def contact():
    return render_template(
        'contact.html',
        title = 'Contact',
        year = datetime.now().year,
        message = 'Your contact page.'
    )

@app.route('/about')
def about():
    return render_template(
        'about.html',
        title = 'About',
        year = datetime.now().year,
        message = 'Your application description page.'
    )

@app.route("/purchases")
def purchases():
    return render_template("Purchases.html")

@app.route("/cycles")
def cycles():
    return render_template("Cycles.html")


#---------------------------- GET REQUESTS TO RETRIEVE THE USER'S INFORMATION -----------------------------

@app.route('/purchases/<id>', methods=['GET'])
def get_purchases(id):
    purchases = persist.retrieve_purchases_by_user(id)
    return json_util.dumps(purchases)

@app.route('/resources/<id>', methods=['GET'])
def get_resources(id):
    resources = persist.retrieve_resources(id)
    return json_util.dumps(resources)

@app.route('/resources/types', methods=['GET'])
def get_resource_types():
    resource_types = persist.retrieve_resource_types()
    return json_util.dumps(resource_types)

@app.route('/cycles/<id>', methods=['GET'])
def get_cycles(id):
    cycles = persist.retrieve_cycles_by_user(id)
    return json_util.dumps(cycles)

@app.route("/uses/<id>", methods=['GET'])
def get_uses(id):
    uses = persist.retrieve_uses_by_user(id)
    return json_util.dumps(uses)


#---------------------------------- POST REQUESTS TO INSERT DATA INTO THE DATASBASE ----------------------  

@app.route("/register/new", methods=['POST'])
def add_user():
    print request.form
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    county = request.form['location']
    password = request.form['password']
    print county
    #persist.insert_user(firstName, lastName, county, password)
    return redirect('login.html')

@app.route("/resources/new", methods=['POST'])
def add_resource():
    form = request.form
    print request.form
    user_id = form['userId']
    resource_name = form['resourceName']
    resource_type = form['resourceType']
    resource = persist.insert_resource(user_id, resource_name, resource_type)
    return json_util.dumps(resource)

@app.route("/cycles/new", methods=['POST'])
def add_cycle():

    print request.form
    user_id = request.form['userId']
    crop = request.form['crop']
    landQuantifier = request.form['landQuantifier']
    landQty = request.form['landQty']
    date = request.form['date']
    cycle = persist.insert_cycle(user_id, crop, landQuantifier, landQty, date)
    return json_util.dumps(cycle)


@app.route("/purchases/make", methods=['POST'])
def add_purchase():
    #user: user_id,
    #type: resource_type,
     #           name: name,
      #          qty: qty_purchased,
       #         cost: cost,
        #        quantifier: quanitifier,
         #       qty_remaining: qty
    print request.form
    user = request.form['userId']
    date = request.form['date']
    resource_type = request.form['resourceType']
    resource_name = request.form['resourceName']
    qty = request.form['qty']
    cost = request.form['cost']
    quantifier = request.form['quantifier']
    qty_remaining = qty
    entry = persist.insert_purchase(user, resource_name, date, resource_type, quantifier,qty, qty_remaining, cost)
    print 'Successfuly loaded new purchase for user ', user 
    return json_util.dumps(entry);

# ------------------------------ PUT requests to update the data -------------------------------------------------

@app.route('/resources/update/<id>', methods=['PUT'])
def edit_resource(id):
    print request.form
    persist.edit_resource(id, request.form['resourceName'], request.form['resourceType'])