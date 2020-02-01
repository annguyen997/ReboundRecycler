import os 
from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy #Replace this line with MongoDB code at some point
from datetime import datetime

"""Configuration"""
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'  #Replace this line later 
db = SQLAlchemy(app) #Name of this file (app.py) 

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

"""
class BountyObject(db.Model):
    bountyID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    userID = db.Column(db.Integer, foreign_key=True)
    #location = 
    #price = db.Column(db.Float, nullable=False) 
    state = db.Column(db.String(2), nullable=False)
    desc = db.Column(db.String(500), nullable=False)

class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False)
    password = db.Column(db.String(40), nullable=False)
    #picture
    #bio

class Job(db.Model):
    userID = db.Column(db.Integer, primary_key=True, foreign_key=True)
    bountyID = db.Column(db.Integer, primary_key=True, foreign_key=True)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    completion_time = db.Column(db.DateTime) 
    success = db.Column(db.Boolean)
""" 

"""MAIN"""
@app.route('/', methods=['POST', 'GET']) #URL route string of the app 
def hello_world():

    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Todo(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue adding your tasl'

    else: #Render the page. 
        tasks = Todo.query.order_by(Todo.date_created).all()
        #target = os.environ.get('TARGET', 'World')
        #return 'Hello {}!\n'.format(target)
        return render_template('index.html', tasks=tasks)

@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)
    
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return "There was a problem deleting that task."

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task.'
    else:
        return render_template('update.html', task=task)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))