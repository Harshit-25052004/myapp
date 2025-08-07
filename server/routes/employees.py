from flask import Blueprint, jsonify

def employees_bp(db):
    bp = Blueprint('employees', __name__)

    @bp.route('/')
    def get_employees():
        employees = list(db.employees.find({}, {'_id': 0}))
        return jsonify(employees)

    return bp
