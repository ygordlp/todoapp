// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
        return console.log('Unable to connect to DB.');
    }

    console.log('Connected to MongoDB server.');

    //delete many
    // db.collection('Todos').deleteMany({text: 'Create fake data'}).then((result) => {
    //     console.log(result.result.n);
    //     db.close();
    // });
    
    //delete one
    // db.collection('Todos').deleteOne({text: 'Create fake data'}).then((result) => {
    //     console.log(result.result.n);
    //     db.close();
    // });

    //find and delete
    // db.collection('Todos').findOneAndDelete({text: 'Create fake data'}).then((result) => {
    //     console.log(result.value);
    //     db.close();
    // });
    db.collection('Todos').findOneAndDelete({_id: new ObjectID('597b1c5446f10865145e1880')}).then((result) => {
        console.log(result.value);
        db.close();
    });
});