import os
from flask import jsonify, render_template
from kitchenmanager import app, db
from kitchenmanager.models import Message, User, Wallet, Supplier, BoughtItem, ManufactoredItem, Recipe, SellableItem, StockMovement, Order, Delivery


@app.route('/')
def home():
    return render_template('home.html', g_client_id=os.environ.get("GOOGLE_CLIENT_ID"))


@app.route('/menu')
def menu():
    return render_template('menu.html')


@app.route('/seat')
def seat():
    return render_template('seat.html')
