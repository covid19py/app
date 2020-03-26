from flask import Flask, request, render_template, send_from_directory, jsonify
from flask_pymongo import PyMongo, ASCENDING, DESCENDING
from bson.objectid import ObjectId

from flask_json_schema import JsonSchema

app = Flask(__name__, static_url_path='', template_folder='templates')

from os import environ
if 'MONGO_URI' in environ:
    app.config["MONGO_URI"] = environ['MONGO_URI']
else:
    app.config["MONGO_URI"] = "mongodb://localhost:27017/app"
mongo = PyMongo(app)

@app.route('/static/<path:path>')
def send_react_assets(path):
    return send_from_directory('build/static', path)

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('assets', path)

@app.route("/")
def home():
    return send_from_directory('build', 'index.html')

@app.route("/manifest.json")
def manifest():
    return send_from_directory('build', 'manifest.json')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('build', 'favicon.ico')

@app.route('/', methods=['POST'])
def post():
    req_data = request.get_json()
    # Cargar coordenadas como Point (GeoJSON)
    lat = req_data['coordenadas']['lat']
    lng = req_data['coordenadas']['lng']
    loc = {'coordinates': [lat, lng], 'type': 'Point'}
    req_data['coordenadas'] = loc
    mongo.db.denuncias.insert_one(req_data)
    output = {}
    return jsonify(output)

@app.route("/reporte")
def reporte():
    return render_template('reporte.html')

@app.route("/reporte/denuncias", methods=['POST'])
def reporte_denuncias():
    objects = []
    geoquery = request.get_json()
    for d in mongo.db.denuncias.find(
        {
            'estado': 'pendiente',
            'coordenadas': {
                '$geoWithin': {
                    '$box': geoquery
                }
            },
        }).sort('_id', ASCENDING):
        ts = d['_id'].generation_time
        point = d['coordenadas']['coordinates']
        custom_fields = {}
        if 'custom_fields' in d:
            custom_fields = d['custom_fields']
        obj = {
            '_id': str(d['_id']),
            'coordenadas': point,
            'canal': d['canal'],
            'tipo_denuncia': d['tipo_denuncia'],
            'denunciante': d['nombre'] + ' ' + d['apellido'],
            'observaciones': d['observaciones'],
            'creado': int(ts.timestamp()),
            'estado': d['estado'],
            'campos': custom_fields
        }
        objects.append(obj)
    return jsonify(objects)

@app.route("/reporte/denuncias/<id>/atendida")
def denuncia_atendida(id):
    oid = ObjectId(id)
    query = {'_id': oid}
    updates = {'$set': {'estado': 'atendida'}}
    mongo.db.denuncias.update_one(query, updates)
    obj = {}
    return jsonify(obj)

if __name__ == '__main__':
    app.run(debug=True)
