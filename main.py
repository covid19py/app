from flask import Flask, request, render_template, send_from_directory, jsonify
from flask_pymongo import PyMongo, ASCENDING, DESCENDING

from flask_json_schema import JsonSchema

 
app = Flask(__name__, static_url_path='', template_folder='build')

app.config["MONGO_URI"] = "mongodb://localhost:27017/app"
mongo = PyMongo(app)

@app.route('/static/<path:path>')
def send_assets(path):
    return send_from_directory('build/static', path)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/denuncias', methods=['POST', 'GET'])
def post_denuncias():
    if request.method == 'POST':
        req_data = request.get_json()
        mongo.db.denuncias.insert_one(req_data)
        return render_template('index.html')
    
    elif request.method == 'GET':
        result = []
        cursor = mongo.db.denuncias.find()
        for d in cursor:
            d.pop('_id') 
            result.append(d)            
        return jsonify({"denuncias": result})


if __name__ == '__main__':
    app.run(debug=True)
