# Covid19-PY

# Requisitos
- Nodejs v12.x
- Python 3.7
- Mongo 4.x

## First time setup para correr los templates React en modo desarrollo (formulario de denuncias)
``` bash
$ cd templates/form_denuncias
$ yarn
$ yarn dev
```
Levanta la app React en modo desarrollo usando [Webpack devserver](https://webpack.js.org/configuration/dev-server/)<br />
Abrir [http://localhost:3000](http://localhost:3000).

## Levantar la App usando Python (Flask, usando virtualenv)
```
$ virtualenv venv
$ source venv/bin/activate
$ pip3 install -r requirements.txt
$ python3 -m flask run
```

## Compilar los templates React para usar con la App Python
``` bash
$ cd templates/form_denuncias
$ yarn build
```

Después de compilar la App Js el server Python ya es capaz de tomar el template compilado desde `templates/form_denuncias/dist`
