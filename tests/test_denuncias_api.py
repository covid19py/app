from http import client
import json

#import ../schemas/denuncia
denuncia = {
    "fecha_creacion": {
        "type": "integer"
    },
    "fecha_actualizacion": {
        "type": "integer",
    },
    "canal": {
        "type": "string",
        "description": "Canal a través del que se recibe la denuncia"
    },
    "nombre": {
        "type": "string",
        "description": "Nombre del denunciante"
    },
    "apellido": {
        "description": "Apellido del denunciante",
        "type": "string",
        "minimum": 0
    },
    "telefono": {
        "description": "Número telefónico del denunciante",
        "type": "string"
    },
    "correo": {
        "description": "Correo electrónico del denunciante",
        "type": "string"
    },
    "departamento": {
        "description": "Departamento",
        "type": "string"
    },
    "ciudad": {
        "description": "Ciudad",
        "type": "string"
    },
    "barrio": {
        "description": "Barrio",
        "type": "string"
    },
    "tipo_denuncia": {
        "description": "Tipo de denuncia",
        "type": "string"
    },
    "coordenadas": {
        "description": "Coordenadas geográficas",
        "type": "array",
        "items": [
            { "type": "integer" },
            { "type": "integer" }
        ]
    },
    "observaciones": {
        "description": "Observaciones adicionales",
        "type": "string"
    },
    "estado": {
        "description": "Estado de la denuncia",
        "type": "string"
    }
}



url = 'loclahost'
headers = {"Content-type": "application/json"}

def crear_denuncia():
    conn = client.HTTPConnection('localhost', 5000)
    params = json.dumps(denuncia)    
    r = conn.request("POST", "/denuncias", params, headers=headers)
    
def obtener_denuncia():
    conn = client.HTTPConnection('localhost', 5000)
    conn.request("GET", "/denuncias", headers=headers)
    r = conn.getresponse()
    print(json.loads(r.read()))

crear_denuncia()
obtener_denuncia()

