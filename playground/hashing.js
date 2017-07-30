const {SHA256} = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log('Message:', message);
console.log('Hash:', hash);

var data = {
    id: 4
};

// var token = {
//     data: data, 
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// if(resultHash === token.hash){
//     console.log('Data was not change');
// } else {
//     console.log('Data was change. DO NOT TRUST.');
// }

//WITH JWT
const jwt = require('jsonwebtoken');

var token = jwt.sign(data, '123adbc');
console.log('JWT:', token);

var decoded = jwt.verify(token, '123adbc');
console.log('Decoded:', decoded);