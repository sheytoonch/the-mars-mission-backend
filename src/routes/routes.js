/**
 * @file routes.js
 * @description The request is matched to a route and triggers its controller.
 */

const express = require('express');
const router = express.Router();
const astronautController = require('../controllers/astronautController');
const healthController = require('../controllers/healthController');

router.get('/health/check', healthController.checkHealth);
router.get('/astronauts', astronautController.getAstronauts);

router.post('/astronauts', astronautController.createAstronaut);
router.get('/astronauts/:id', astronautController.getAstronautById);
router.put('/astronauts/:id', astronautController.updateAstronaut);
router.delete('/astronauts/:id', astronautController.deleteAstronaut);


module.exports = router;
