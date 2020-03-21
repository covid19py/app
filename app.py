from flask import Flask, request, render_template, send_from_directory
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

@app.route('/', methods=['POST'])
def post():
    req_data = request.get_json()
    mongo.db.denuncias.insert_one(req_data)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
