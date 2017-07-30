const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const dummyData = [{
    _id: new ObjectID(),
    text: 'Todo test 1',
    completed: true,
    completedAt: 1234567890
}, {
    _id: new ObjectID(),
    text: 'Todo test 2'
},{
    _id: new ObjectID(),
    text: 'Todo test 3'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(dummyData);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test add new todo text';

    request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(dummyData.length + 1);
                expect(todos[dummyData.length ].text).toBe(text);
                done();
            }).catch((e) => done(e))
        });
    });

    it('should NOT create a new todo with invalid data', (done) => {
       
    request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(dummyData.length);
                done();
            }).catch((e) => done(e))
        });
    });    

});

describe('GET /todos', () => {
    it('should get all data', (done) => {
    request(app)
        .get('/todos')
        .send({})
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(dummyData.length);
        })
        .end(done);
    });
});   

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
    request(app)
        .get(`/todos/${dummyData[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(dummyData[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
    request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 if invalid id', (done) => {
    request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});   

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
    request(app)
        .delete(`/todos/${dummyData[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(dummyData[0].text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.findById(dummyData[0]._id.toHexString()).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
    request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 if invalid id', (done) => {
    request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });
});   

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
    var dummy = dummyData[1];
    var newText = "Text changed"
    request(app)
        .patch(`/todos/${dummy._id.toHexString()}`)
        .expect(200)
        .send({
            text: newText,
            completed: true
        })
        .expect((res) => {
            //check server response
            var todo = res.body.todo;
            expect(todo.text).toBe(newText);
            expect(todo.completed).toBe(true);
            expect(todo.completedAt).toBeA('number');
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            //check database
            Todo.findById(dummy._id.toHexString()).then((todo) => {
                expect(todo.text).toBe('Text changed');
                expect(todo.completed).toBe(true);
                expect(todo.completedAt).toBeA('number');
                done();
            }).catch((e) => done(e));
        });
    });

    it('should update the todo and clear completedAt', (done) => {
    var dummy = dummyData[0];
    request(app)
        .patch(`/todos/${dummy._id.toHexString()}`)
        .expect(200)
        .send({
            completed: false
        })
        .expect((res) => {
            var todo = res.body.todo;
            expect(todo.text).toBe(dummy.text);
            expect(todo.completed).toBe(false);
            expect(todo.completedAt).toNotExist();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.findById(dummyData[0]._id.toHexString()).then((todo) => {
                expect(todo.text).toBe(dummy.text);
                expect(todo.completed).toBe(false);
                expect(todo.completedAt).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
    request(app)
        .patch(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 if invalid id', (done) => {
    request(app)
        .patch('/todos/123')
        .expect(404)
        .end(done);
    });
});   





