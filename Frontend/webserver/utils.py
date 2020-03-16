#from dotenv import load_dotenv
import requests


backend_uri = 'http://localhost:8080'

def req(method, endpoint, headers = {}, params = {}, body = {}):
    url = backend_uri + endpoint
    data, status_code = {}, 500
    if method.lower() == 'get':
        res = requests.get(url = url, params = params, headers = headers)
    elif method.lower() == 'post':
        res = requests.post(url = url, headers = headers, json = body)
    elif method.lower() == 'put':
        res = requests.put(url = url, headers = headers, json = body)
    elif method.lower() == 'delete':
        res = requests.delete(url = url, headers = headers, json = body)
    else:
        res = {}
    
    if res != {}:
        if res.status_code in range(500):
            data = res.json()
            status_code = res.status_code
        elif res.status_code in range(500, 700):
            print("Internal Server Error ({}): {}".format(res.status_code, json.dumps(res)))
    return data, status_code
