const mongoose = require("mongoose");
const Person = require("./models/Person");

// Insufficient args
if (process.argv.length < 3) {
    console.log("Requires 1 or 3 arguments. Please include at least your DB password, or also include the new name and number to add to the phonebook.");
    process.exit(1);
}

// Connect to db
const password = process.argv[2];
const url = `mongodb+srv://bensuwun:${password}@mongodb-cluster.8k1fvxl.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
mongoose.connect(url);

// Log all entries in phonebook.
if (process.argv.length == 3) {
    Person.find({}).then(persons => {
        console.log("Phonebook:");
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}

// Add new entry
else if (process.argv.length == 5) {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
    newPerson.save().then(() => {
        console.log(`Added ${newPerson.name} with number ${newPerson.number} to phonebook.`);
        mongoose.connection.close();
    });
}