from flask import Blueprint, jsonify
from bson import ObjectId

def properties_bp(db):
    properties_collection = db.properties
    bp = Blueprint('properties', __name__)

    # ---------------------------
    # GET all properties
    # ---------------------------
    @bp.route('/', methods=['GET'])
    def get_properties():
        try:
            properties = list(properties_collection.find())
            for p in properties:
                p["_id"] = str(p["_id"])
            return jsonify(properties), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ---------------------------
    # GET grouped plots for a property
    # ---------------------------
    @bp.route('/<property_id>/plots', methods=['GET'])
    def get_property_plots(property_id):
        # 1️⃣ Validate ObjectId format
        try:
            prop_id = property_id
        except Exception:
            return jsonify({
                "error": "Invalid property ID format",
                "hint": "Use a valid 24-character hex MongoDB ObjectId"
            }), 400

        # 2️⃣ Check if property exists
        property_data = properties_collection.find_one({"_id": prop_id})
        if not property_data:
            return jsonify({
                "error": "Property not found",
                "property_id": property_id,
                "hint": "Check if this ID exists in your database and DB name is correct"
            }), 404

        # 3️⃣ Check if plots field exists
        plots = property_data.get("plots")
        if not plots:
            return jsonify({
                "error": "No plots found for this property",
                "property_id": property_id,
                "name": property_data.get("name", "")
            }), 200  # Valid request, just no data

        # 4️⃣ Group plots by status
        grouped = {
            "available": [],
            "booked": [],
            "hold": [],
            "complete": []
        }
        for plot in plots:
            status = plot.get("status", "").lower()
            if status in grouped:
                grouped[status].append(plot)
            else:
                grouped["available"].append(plot)  # default fallback

        # 5️⃣ Return grouped plots
        return jsonify({
            "property_id": property_id,
            "name": property_data.get("name", ""),
            "plots": grouped
        }), 200
    

    @bp.route('/<property_id>', methods=['GET'])
    def get_property_by_id(property_id):
        try:
            prop_id = property_id
            property_data = properties_collection.find_one({"_id": prop_id})
            if not property_data:
                return jsonify({"error": "Property not found"}), 404
        
            property_data['_id'] = str(property_data['_id'])
            return jsonify(property_data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return bp
