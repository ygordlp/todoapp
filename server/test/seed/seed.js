const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');

const user1Id = new ObjectID();
const user2Id = new ObjectID();
const testUsers = [{
    _id: user1Id,
    email: 'user1@test.com',
    password: 'password1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1Id, access:'auth'}, 'secretKEY').toString()
        }]
    },{
        _id: user2Id,
        email: 'user2@test.com',
        password: 'password2',
        tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user2Id, access:'auth'}, 'secretKEY').toString()
        }]
    }];

const testTodos = [{
    _id: new ObjectID(),
    text: 'Todo test 1',
    completed: true,
    completedAt: 1234567890,
    _creator: user1Id
}, {
    _id: new ObjectID(),
    text: 'Todo test 2',
    _creator: user1Id
},{
    _id: new ObjectID(),
    text: 'Todo test 3',
    _creator: user2Id
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(testUsers[0]).save();
        var user2 = new User(testUsers[1]).save();

        return Promise.all([user1, user2]);
    }).then(() => done())
    .catch((e) => {
        console.log('Populate users error', e);
    });
};

module.exports = {testTodos, populateTodos, testUsers, populateUsers}