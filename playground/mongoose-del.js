const {mongoose} = require('./../server/db/mongoose');
var {ObjectID} = require('mongodb');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');

const dummyData = [{
    _id: new ObjectID(),
    text: 'Todo test 1'
}, {
    _id: new ObjectID(),
    text: 'Todo test 2'
},{
    _id: new ObjectID(),
    text: 'Todo test 3'
}];

Todo.insertMany(dummyData).then(() => {
    // Todo.remove({}).then((result) => {
    //     console.log(result);
    // });

    Todo.findByIdAndRemove({}).then((result) => {
        console.log(result);
    });
});