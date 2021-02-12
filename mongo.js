const mongoose = require('mongoose');

if (process.argv.length != 3 && process.argv.length != 5) {
    console.log('usage: mongo <password> <name> <number>');
    process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://notesapp:${password}@cluster0.epgmx.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length == 5) {
    const name = process.argv[3];
    const number = process.argv[4];


    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then(result => {
        console.log(result);
        mongoose.connection.close();
    });
} else if (process.argv.length == 3) {
    Person.find({}).then(persons => {
        persons.forEach(p => console.log(`${p.name}, ${p.number}`));
        mongoose.connection.close();
    });
}