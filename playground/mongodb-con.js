// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
        return console.log('Unable to connect to DB.');
    }

    console.log('Connected to MongoDB server.');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (error, result) => {
    //     console.log('Any results?');
    //     if(error){
    //         return console.log('Unable to insert todo ', error);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Yuri',
    //     age: 35,
    //     location: 'Usa'
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user ', error);
    //     }

    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    db.close();
});