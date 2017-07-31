const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/User');
const {testTodos, populateTodos, testUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
                expect(todos.length).toBe(testTodos.length + 1);
                expect(todos[testTodos.length ].text).toBe(text);
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
                expect(todos.length).toBe(testTodos.length);
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
            expect(res.body.todos.length).toBe(testTodos.length);
        })
        .end(done);
    });
});   

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
    request(app)
        .get(`/todos/${testTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(testTodos[0].text);
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
        .delete(`/todos/${testTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(testTodos[0].text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.findById(testTodos[0]._id.toHexString()).then((todo) => {
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
    var dummy = testTodos[1];
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
    var dummy = testTodos[0];
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

            Todo.findById(testTodos[0]._id.toHexString()).then((todo) => {
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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', testUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(testUsers[0]._id.toHexString());
                expect(res.body.email).toBe(testUsers[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
       var email = 'test@test.com';
       var password = 'somepass';

       request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
       var email = 'test.com';
       var password = 'somepass';

       request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
       var email = testUsers[0].email;
       var password = 'somepass';

       request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: testUsers[1].email,
                password: testUsers[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findById(testUsers[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });

                    done();
                }).catch((e) => done(e));
            });
      
    });

    it('should reject invalid login', (done) => {
       request(app)
            .post('/users/login')
            .send({
                email: testUsers[1].email,
                password: 'wrongpassword'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', testUsers[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findById(testUsers[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});



