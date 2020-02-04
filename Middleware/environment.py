import json

class environment:
    def __init__(self, file_path = "./.env"):
        self.vars = None
        try:
            handler = open(file_path, 'r')
            data = handler.read()
            self.vars = json.loads(data)
            handler.close()
        except Exception as e:
            print("Unabled to load environment from {} {}".format(file_path, e))

    def get_env(self, var):
        if var in self.vars:
            return self.vars[var]
        return None
