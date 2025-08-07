from flask import Blueprint, jsonify
from bson import ObjectId, errors

def properties_bp(db):
    bp = Blueprint('properties', __name__)

    @bp.route('/')
    def get_properties():
        try:
            print("📋 Fetching all properties...")
            
            # Return all necessary fields for the frontend
            properties = list(db.properties.find({}, {
                '_id': 1, 
                'name': 1, 
                'rate': 1, 
                'address': 1, 
                'specification': 1, 
                'total_plots': 1,
                'image': 1
            }))
            
            print(f"Found {len(properties)} properties")
            
            # Convert ObjectId to string for JSON serialization
            for prop in properties:
                prop['_id'] = str(prop['_id'])
            
            return jsonify(properties)
        
        except Exception as e:
            print(f"❌ Error in get_properties: {str(e)}")
            return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

    @bp.route('/<property_id>/plots', methods=['GET'])
    def get_plots_by_property(property_id):
        try:
            print(f"🔍 Received request for property_id: {property_id}")
            
            # Validate ObjectId format
            try:
                object_id = ObjectId(property_id)
                print(f"✅ Successfully converted to ObjectId: {object_id}")
            except errors.InvalidId:
                print(f"❌ Invalid ObjectId format: {property_id}")
                return jsonify({"error": "Invalid property ID format"}), 400

            # Check if property exists
            print(f"🔍 Searching for property in database...")
            property_data = db.properties.find_one({"_id": object_id}, {"plots": 1, "_id": 0})
            
            if not property_data:
                print(f"❌ Property not found for ID: {property_id}")
                # Let's also check what properties DO exist
                all_properties = list(db.properties.find({}, {"_id": 1, "name": 1}))
                print(f"Available properties in database:")
                for prop in all_properties:
                    print(f"   - {prop['_id']} ({prop.get('name', 'No name')})")
                return jsonify({"error": "Property not found"}), 404

            plots = property_data.get("plots", [])
            print(f"✅ Found {len(plots)} plots for property")

            # If no plots field exists, let's check what fields ARE available
            if "plots" not in property_data:
                # Get the full property to see its structure
                full_property = db.properties.find_one({"_id": object_id})
                print(f"📋 Property structure: {list(full_property.keys()) if full_property else 'None'}")

            categorized = {
                "all": plots,
                "available": [p for p in plots if p.get("status", "").lower() == "available"],
                "booked": [p for p in plots if p.get("status", "").lower() == "booked"],
                "hold": [p for p in plots if p.get("status", "").lower() == "hold"],
                "complete": [p for p in plots if p.get("status", "").lower() == "complete"]
            }

            print(f"✅ Returning categorized plots: all={len(plots)}, available={len(categorized['available'])}")
            return jsonify(categorized)

        except Exception as e:
            print(f"❌ Error in get_plots_by_property: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

    return bp