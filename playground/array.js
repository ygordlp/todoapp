var all = [{
    name: 'Ygor',
    age: 36
}, {
    name: 'Leo',
    age: 28
}, {
    name: 'Joe',
    age: 40
}, {
    name: 'Erick',
    age: 18
}, {
    name: 'Yuri',
    age: 12
}, {
    name: 'Daniel',
    age: 4
}, {
    name: 'Juliana',
    age: 31
}, {
    name: 'Gabriel',
    age: 2
}];

var filtered = all.filter((user) => { return user.age < 30});

console.log(filtered);