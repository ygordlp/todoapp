const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');

//var id = '597b6a9ddd655c0c8cf46912';

// if(!ObjectID.isValid(id)){
//     console.log('Id not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('\nTodo:', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log("Id not found");
//     }
//     console.log('\nTodo by id:', todo);
// }).catch((e) => console.log(e));

User.findById('597b77c3531c9d016477e375').then((user) => {
    if(!user){
        return console.log("User not found");
    }
    console.log('\User by id:', user);
}).catch((e) => console.log(e));