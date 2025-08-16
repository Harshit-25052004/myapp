from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash  # if using hashed passwords

def employees_bp(db):
    bp = Blueprint('employees', __name__)

    @bp.route('/', methods=['GET'])
    def get_employees():
        employees = list(db.employees.find({}, {'_id': 0}))
        return jsonify(employees)

    @bp.route('/login', methods=['POST'])
    def login():
        if not request.is_json:
            return jsonify({"success": False, "error": "Content-Type must be application/json"}), 415

        data = request.get_json()

        userid = data.get('userid')
        password = data.get('password')

        if not userid or not password:
            return jsonify({"success": False, "error": "User ID and password are required"}), 400

        # Look up user in MongoDB
        user = db.employees.find_one({"userid": userid}, {'_id': 0})

        if not user:
            return jsonify({"success": False, "error": "User not found"}), 401

        # If using plain text passwords (not recommended):
        # if user['password'] != password:
        #     return jsonify({"success": False, "error": "Invalid password"}), 401

        # If using hashed passwords:
        if not check_password_hash(user['password'], password):
            return jsonify({"success": False, "error": "Invalid password"}), 401

        # Remove password before sending user object
        user.pop('password', None)

        return jsonify({"success": True, "user": user}), 200

    return bp
