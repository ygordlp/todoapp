// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
        return console.log('Unable to connect to DB.');
    }

    console.log('Connected to MongoDB server.');

    db.collection('Todos').findOneAndUpdate(
        {
            _id: new ObjectID('597b1c8246f10865145e1886')
        },
        {
            $set: {
                completed: false
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
            db.close();
        });
});