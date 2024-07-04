from flask import render_template
from kitchenmanager import app, db
from kitchenmanager.models import Message, User, Wallet, Supplier, BoughtItem, ManufactoredItem, Recipe, SellableItem, StockMovement, Order, Delivery


@app.route('/')
def home():
    return render_template('base.html')