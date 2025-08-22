from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import sys
import os

# Add the directory containing the routes module to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes.clients import clients_bp
from routes.employees import employees_bp
from routes.properties import properties_bp

app = Flask(__name__)

# ✅ FIXED: Allow CORS from React frontend and Node.js proxy
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5000", "http://0.0.0.0:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Connect to MongoDB with error handling
try:
    print("🔄 Connecting to MongoDB...")
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    
    # Test the connection
    client.server_info()
    db = client["local"]
    print("✅ MongoDB connection successful")
    
    # Test if properties collection exists and has data
    properties_count = db.properties.count_documents({})
    print(f"📊 Found {properties_count} properties in database")
    
    if properties_count == 0:
        print("⚠️  Warning: No properties found in database")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None

# Register Blueprints
try:
    app.register_blueprint(clients_bp(db), url_prefix='/api/clients')
    app.register_blueprint(employees_bp(db), url_prefix='/api/employees')
    app.register_blueprint(properties_bp(db), url_prefix='/api/properties')
 
    print("✅ All blueprints registered successfully")
except Exception as e:
    print(f"❌ Error registering blueprints: {e}")

@app.route('/')
def index():
    return {'message': 'Welcome to Haveli Housing Backend (MongoDB Connected)', 'status': 'healthy'}

@app.route('/health')
def health_check():
    try:
        if db is not None:
            # Test database connection
            properties_count = db.properties.count_documents({})
            return {
                'status': 'healthy',
                'database': 'connected',
                'properties_count': properties_count
            }
        else:
            return {'status': 'unhealthy', 'database': 'disconnected'}, 500
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 500

if __name__ == '__main__':
    print("🚀 Starting Flask server on port 500...")
    app.run(debug=True, host='0.0.0.0', port=5001)
