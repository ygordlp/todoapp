const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../server/models/User');

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
        password: 'password2'
    }];

var user1 = new User(testUsers[0]);

console.log(JSON.stringify(user1.toObject(), undefined, 2));
