const express = require('express');
const router = module.exports = express.Router();
const database = require('./database');

router.route('/').get(function(req, res) {

	database.getAll().then(function(results) {
		res.json(results);
	}).catch(function(err) {
		res.status(500).send(err.message);
	});

}).post(function(req, res) {

	database.insert(req.body).then(function(results) {
		res.json(results);
	}).catch(function(err) {
		res.status(500).send(err.message);
	});

});

router.route('/:widgetId').get(function(req, res) {

	database.get(req.params.widgetId).then(function(results) {
		res.json(results);
	}).catch(function(err) {
		res.status(500).send(err.message);
	});
	
});