const AstronautModel = require('../models/astronautModel');
//const astronautValidation = require('../validation/astronautValidation');
const { astronautValidation } = require('../validation/astronautsValidation');

const getAstronauts = (req, res) => {
    AstronautModel.getAllAstronauts((err, astronauts) => {
        if (err) {
            res.status(500).json({ error: `Unexpected server issue ${err}` });
        } else {
            res.json({ astronauts: astronauts });
        }
    });
};

const getAstronautById = (req, res) => {
    const { id } = req.params;
    AstronautModel.getAstronautById(id, (err, astronaut) => {
        if (err) {
            res.status(500).json({ error: `Unexpected server issue ${err}` });
        } else if (!astronaut) {
            res.status(404).json({ error: 'Astronaut not found with the provided ID.' });
        } else {
            res.json({ astronaut: astronaut });
        }
    });
};

const createAstronaut = (req, res) => {
    const { name, role } = req.body;
    const isValid = astronautValidation(name, role);

    if (isValid) {
        AstronautModel.createAstronaut(name, role, (err, astronaut) => {
            console.log("created astronaut", astronaut);
            if (err) {
                res.status(500).json({ error: `Unexpected server issue ${err}` });
            } else {
                res.status(201).json({ message: 'Astronaut added successfully!', astronaut: astronaut });
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid input: Fields must be non-empty strings, between 3-50 characters long, and should not contain any numbers.' });
    }
};

const updateAstronaut = (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body;
    let isValid = true;
    if (!name) {
        if (!validateName(name)) { isValid = false; }
    }
    if (!role) {
        if (!validateRole(role)) { isValid = false; }
    }
    if (isValid) {
        AstronautModel.updateAstronaut(id, { name, role }, (err, astronaut) => {
            if (err) {
                res.status(500).json({ error: `Unexpected server issue ${err}` });
            } else {
                res.status(200).json({ message: 'Astronaut updated successfully!', astronaut: astronaut });
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid input: Fields must be non-empty strings, between 3-50 characters long, and should not contain any numbers.' });
    }
};

const deleteAstronaut = (req, res) => {
    const { id } = req.params;
    AstronautModel.deleteAstronaut(id, (err, astronaut) => {
        if (err) {
            res.status(500).json({ error: `Unexpected server issue ${err}` });
        } else {
            res.status(200).json({ message: 'Astronaut deleted successfully!' });
        }
    });
};

module.exports = {
    getAstronauts,
    getAstronautById,
    createAstronaut,
    updateAstronaut,
    deleteAstronaut
};