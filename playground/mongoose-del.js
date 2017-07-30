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

Todo.remove({}).then(() => {
    return Todo.insertMany(dummyData);
}).then(() => {
    //return Todo.findByIdAndRemove({_id: dummyData[1]._id});
    return Todo.findByIdAndRemove(dummyData[1]._id);
}).then((result) => {
        console.log(result);
}).catch((e) => {
    console.log('Error:', e);
});

