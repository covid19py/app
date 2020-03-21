from flask import Flask, request, render_template, send_from_directory
from flask_pymongo import PyMongo, ASCENDING, DESCENDING

from flask_json_schema import JsonSchema

app = Flask(__name__, static_url_path='', template_folder='build')

from os import environ
if 'MONGO_URI' in environ:
    app.config["MONGO_URI"] = environ['MONGO_URI']
else:
    app.config["MONGO_URI"] = "mongodb://localhost:27017/app"
mongo = PyMongo(app)

@app.route('/static/<path:path>')
def send_assets(path):
    return send_from_directory('build/static', path)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/manifest.json")
def manifest():
    return send_from_directory('./build', 'manifest.json')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('./build', 'favicon.ico')

@app.route('/', methods=['POST'])
def post():
    req_data = request.get_json()
    mongo.db.denuncias.insert_one(req_data)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
