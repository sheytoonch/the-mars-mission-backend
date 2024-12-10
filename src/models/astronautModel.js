const db = require('../db/database');

const getAllAstronauts = (callback) => {
    db.all('SELECT * FROM astronauts', [], (err, astronauts) => {
        callback(err, astronauts);
    });
};

const getAstronautById = (id, callback) => {
    db.all('SELECT * FROM astronauts WHERE id = ?', [id], (err, astronauts) => {
        callback(err, astronauts[0]);
    });
};

const createAstronaut = (name, role, callback) => {
    db.run('INSERT INTO astronauts (name, role) VALUES (?, ?)', [name, role], function (err) {
        if (err) {
            return callback(err, null);
        }
        const createdId = this.lastID; // must be function, not arrow function to witk with "this" keyword
        getAstronautById(createdId, (err, astronaut) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, astronaut);
        });
    });
};

const updateAstronaut = (id, { name, role }, callback) => {
    getAstronautById(id, (err, astronaut) => {
        if (err) {
            return callback(err, null);
        }
        if (!astronaut) {
            return callback({ status: 404, message: 'Astronaut not found' }, null);
        }

        const updatedName = name !== undefined ? name : astronaut.name;
        const updatedRole = role !== undefined ? role : astronaut.role;

        const query = 'UPDATE astronauts SET name = ?, role = ? WHERE id = ?';
        const params = [updatedName, updatedRole, id];

        db.run(query, params, function (err) {
            if (err) {
                return callback(err, null);
            }
            getAstronautById(id, (err, updatedAstronaut) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, updatedAstronaut);
            });
        });
    });
};

const deleteAstronaut = (id, callback) => {
    db.run('DELETE FROM astronauts WHERE id = ?', [id], function (err) {
        if (err) {
            return callback(err, null);
        }
        if (this.changes === 0) {
            return callback({ status: 404, message: 'Astronaut not found with the provided ID.' }, null);
        }
        callback(null, { message: 'Astronaut deleted successfully!' });
    });
}

module.exports = {
    getAllAstronauts,
    getAstronautById,
    createAstronaut,
    updateAstronaut,
    deleteAstronaut
};
