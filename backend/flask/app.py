from flask import Flask, jsonify, json, Response, render_template
from flask_cors import CORS
import api_response_prepare

app = Flask(__name__)
CORS(app)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/api/global')
def fetch_global():
    response = None
    global_latest = api_response_prepare.fetch_global()
    if global_latest == None:
        error_message = {'success': False, 'message': "unknonw error happens"}
        response = Response(json.dumps(error_message), status=301, mimetype="application/json")
    else:
        response = Response(json.dumps(global_latest), status=200, mimetype="application/json")
    return response


@app.route('/api/countries')
def fetch_countries():
    response = None
    countries = api_response_prepare.fetch_countries()
    # countries = modifyCountryName();
    if len(countries) == 0:
        error_message = {'success': False, 'message': "unknonw error happens"}
        response = Response(json.dumps(error_message), status=301, mimetype="application/json")
    else:
        response = Response(json.dumps(countries), status=200, mimetype="application/json")
    return response


@app.route('/api/australia/states')
def fetch_au_states():
    response = None
    australia_states_data = api_response_prepare.fetch_au_states()
    print(australia_states_data)
    if len(australia_states_data) == 0:
        error_message = {'success': False, 'message': "unknonw error happens"}
        response = Response(json.dumps(error_message), status=301, mimetype="application/json")
    else:
        response = Response(json.dumps(australia_states_data), status=200, mimetype="application/json")
    return response


@app.route('/api/australia')
def fetch_au():
    response = None
    australia_latest = api_response_prepare.fetch_au_latest()
    if len(australia_latest) == 0:
        error_message = {'success': False, 'message': "unknonw error happens"}
        response = Response(json.dumps(error_message), status=301, mimetype="application/json")
    else:
        response = Response(json.dumps(australia_latest), status=200, mimetype="application/json")
    return response


if __name__ == '__main__':
    app.run('0.0.0.0',port=5000)