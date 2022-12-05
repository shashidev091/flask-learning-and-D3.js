import os
from datetime import datetime
from flask import Flask, render_template, current_app, request, redirect
from flask_sqlalchemy import SQLAlchemy
from oopsLearning import oop1
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todo.db"
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db = SQLAlchemy(app)

app.config.from_pyfile('config.py')


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), unique=True, nullable=False)
    desc = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f'{self.id} - {self.title}'


@app.route('/')
def home_page():
    all_todos = Todo.query.all()
    return render_template('index.html', context={
        "all_todos": all_todos,
        "title": "Todo App 🤣",
        "person": {
            "name": "Shashi Bhushan Bhagat",
            "place": "Lohardaga",
            "job": "Software Engineer"
        },
        'images': 'https://images.unsplash.com/photo-1667838140461-e803982c65da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    })


app.register_blueprint


@app.route('/name')
def get_my_name():
    return {
        'fname': 'Shashi',
        'lname': 'Bhagat'
    }


@app.route('/all_todos')
def get_all_todos():
    all_todos = Todo.query.all()
    return {"item": all_todos}


@app.route('/addTodo', methods=['POST'])
def add_todos():
    # validate the request method type if yes proceed
    if request.method == 'POST':
        # fetch the data using form object in request
        title = request.form['title']
        desc = request.form['desc']

        # now create instance of Todo Model
        todo = Todo(title=title, desc=desc)

        # add instace to database obj and commit the changes
        db.session.add(todo)
        db.session.commit()
    return redirect('/')


@app.route('/update_todo/<int:id>', methods=['POST'])
def update_todo(id):
    if request.method == 'POST':
        todo = Todo.query.filter_by(id=id).first()
        todo.title = request.form['title']
        todo.desc = request.form['desc']
        db.session.add(todo)
        db.session.commit()
        return redirect('/')
    else:
        return redirect('/')


@app.route('/delete_todo/<int:id>')
def delete_todo(id):
    todo = Todo.query.filter_by(id=id).first()
    db.session.delete(todo)
    db.session.commit()
    return redirect('/')


@app.get("/mango")
def test():
    return render_template('d3.html', context={
        'images': 'https://images.unsplash.com/photo-1667838140461-e803982c65da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    })


@app.get("/d3_second")
def render_d3():
    request_args = list(request.args.keys())
    print(request_args)
    return render_template('d3thrusday.html', context={
        "title": "d3 Second"
    })


@app.get("/d3-tutorial")
def office_course():
    return render_template('friday.html', context={
        "title": "D3.js New 🍇"
    })


@app.get('/d3-fetch')
def return_dummy_json():
    return [
        {"id": 1, "name": "Shashi", "power": 990},
        {"id": 2, "name": "Superman", "power": 860},
        {"id": 3, "name": "Shaktiman", "power": 790},
        {"id": 4, "name": "Goku", "power": 430},
        {"id": 5, "name": "Luffy", "power": 590},
        {"id": 6, "name": "Naruto", "power": 870},
        {"id": 7, "name": "Ironman", "power": 990},
        {"id": 8, "name": "Blackwidow", "power": 570},
        {"id": 9, "name": "Batman", "power": 890},
        {"id": 10, "name": "Flash", "power": 900},
        {"id": 11, "name": "Black Adam", "power": 910}
    ]


@app.route('/friday-25')
def friday_25():
    return render_template('friday25.html', context={
        'title': "D3.js friday 25th"
    })


@app.get('/flask-app')
def learning_flask_with_python():
    student = oop1.Student(name="Shashi Bhushan")
    student.add_items('apple', 20)
    student.add_items('mango', 70)
    student.add_items('banana', 60)
    student.add_items('orange', 40)

    student2 = oop1.Student(name="Bhagat")

    student.sum_all_items()
    print(student2.items, "==========")
    print(student2.return_new())

    def modify(function):
        def wrapper(*args):
            return function(*args) + 200
        return wrapper
        

    @modify
    def add(a, b):
        return a + b

    print(add(22, 44))
    student.return_new()

    return student.full_name()


if __name__ == "__main__":
    app.run(debug=True, port=8000)
