from flask import Blueprint, jsonify, request

def clients_bp(db):
    bp = Blueprint('clients', __name__)

    @bp.route('/', methods=['GET'])
    def get_clients():
        clients = list(db.clients.find({}, {'_id': 0}))
        return jsonify(clients)

    @bp.route('/', methods=['POST'])
    def create_client():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid data'}), 400
        db.clients.insert_one(data)
        return jsonify({'message': 'Booking successful'}), 201

    return bp
