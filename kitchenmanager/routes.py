import json
import os
from flask import jsonify, render_template, request
from kitchenmanager import app, db
from kitchenmanager.models import Message, User, Wallet, Supplier, BoughtItem, ManufactoredItem, Recipe, SellableItem, StockMovement, Order, Delivery
from kitchenmanager.web3interface import check_role, grant_role


@app.route('/')
def home():
    return render_template('home.html', g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))


@app.route('/menu')
def menu():
    return render_template('menu.html', g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))


@app.route('/seat')
def seat():
    return render_template('seat.html', g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))


@app.route('/owner/<web3_address>')
def owner(web3_address):
    query = db.session.query(User).filter(User.web3_address == web3_address).first()
    print('query = ', query)
    if query is None:
        return render_template('newemployee.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    else:
        return render_template('owner.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    

@app.route('/manager/<web3_address>')
def manager(web3_address):
    query = db.session.query(User).filter(User.web3_address == web3_address).first()
    print('query = ', query)
    if query is None:
        return render_template('newemployee.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    else:
        return render_template('manager.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    

@app.route('/chef/<web3_address>')
def chef(web3_address):
    query = db.session.query(User).filter(User.web3_address == web3_address).first()
    print('query = ', query)
    if query is None:
        return render_template('newemployee.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    else:
        return render_template('chef.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    

@app.route('/waiter/<web3_address>')
def waiter(web3_address):
    query = db.session.query(User).filter(User.web3_address == web3_address).first()
    print('query = ', query)
    if query is None:
        return render_template('newemployee.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    else:
        return render_template('waiter.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    

@app.route('/customer/<web3_address>')
def owncustomerer(web3_address):
    query = db.session.query(User).filter(User.web3_address == web3_address).first()
    print('query = ', query)
    if query is None:
        return render_template('customer.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))
    else:
        return render_template('owner.html', web3_address=web3_address, g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))

