from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from routes.clients import clients_bp
from routes.employees import employees_bp
from routes.properties import properties_bp

app = Flask(__name__)

# ✅ FIXED: Allow CORS from React frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["local"]

# Register Blueprints
app.register_blueprint(clients_bp(db), url_prefix='/api/clients')
app.register_blueprint(employees_bp(db), url_prefix='/api/employees')
app.register_blueprint(properties_bp(db), url_prefix='/api/properties')

@app.route('/')
def index():
    return {'message': 'Welcome to Haveli Housing Backend (MongoDB Connected)'}

if __name__ == '__main__':
    app.run(debug=True)
