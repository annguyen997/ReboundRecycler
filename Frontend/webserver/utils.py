#from dotenv import load_dotenv
import requests


backend_uri = 'http://localhost:8080'

def req(method, endpoint, headers = {}, params = {}, body = {}):
    url = backend_uri + endpoint
    data = {}
    if method is 'get':
        res = requests.get(url = url, params = params, headers = headers)
    elif method is 'post':
        res = requests.post(url = url, headers = headers, json = body)
    else:
        res = {}
    
    if res.status_code == 200:
        data = res.json()
    return data, res.status_code
