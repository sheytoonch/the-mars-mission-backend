// '.verbose()' allows for stacking error logs.
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const pathToAstronautsDB = path.join(__dirname, '../../db/astronauts.db');

// Path is related to where the Node.js process was started - root of the project
// and not the file that is being executed. It can cause error if structure of the
// project is changed. It is better to use '__dirname' as the reference point.
const db = new sqlite3.Database(pathToAstronautsDB, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(`Connected to the 'astronauts' database.`);
    }
});

// This query runs every time the service is started and creates 'astronauts' table
// if it's missing. Then fills it with default data.
db.serialize(() => {
    db.run(`
        CREATE TABLE astronauts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT
        )
    `, (err) => {
        if (!err) {
            console.log(`Table 'astronauts' created.`);
            insertDefaultData();
        }
    });
});

// This function is hoisted, which means that it is actually at the top of the file
// and can be called before it is defined.
const insertDefaultData = () => {
    const pathToAstronautsDefaultDataFile = path.join(__dirname, '../../data/astronauts.json');
    const jsonString = fs.readFileSync(pathToAstronautsDefaultDataFile);
    const astronauts = JSON.parse(jsonString);

    // .prepare(query) prepares reusable query template
    const insertStatement = db.prepare('INSERT INTO astronauts (name, role) VALUES (?, ?)');
    astronauts.forEach(astronaut => {
        insertStatement.run(astronaut.name, astronaut.role);
    });
    insertStatement.finalize(() => {
        console.log(`Default data inserted into 'astronauts' table`);
    });
};

module.exports = db;
