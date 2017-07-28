// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
        return console.log('Unable to connect to DB.');
    }

    console.log('Connected to MongoDB server.');

    // db.collection('Todos').find().toArray().then((docs) =>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log('Unable to get dos', error);
    // });
    var cursor = db.collection('Todos').find();
    var total;
    cursor.count()
    .then((size) =>{
        total = size;
        return cursor.filter({text: /other/}).toArray();
    }).then((docs) => {
        var result = {
            total: total,
            countFilte: docs.length,
            filtered: docs
        };
        console.log(JSON.stringify(result, undefined, 2));
        db.close();
    }).catch((error) => {
        console.log('Unable to get dos', error);
        db.close();
    });
    

    //db.close();.filter()
});
