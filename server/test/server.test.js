const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const dummyData = [{
    text: 'Todo test 1'
}, {
    text: 'Todo test 2'
},{
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



