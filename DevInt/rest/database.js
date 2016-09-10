const { MongoClient, ObjectId } = require('mongodb');
const { mongoServer: mongoServerConfig } = require('./package.json');

var url = `mongodb://${mongoServerConfig.host}:${mongoServerConfig.port}/${mongoServerConfig.database}`;

const database = new Promise(function(resolve, reject) {

	MongoClient.connect(url, function(err, db) {

		if (err) {
			reject(err);
			return;
		}

		resolve(db);
	});

});

database.getAll = (function() {

	return this.then(db =>
		new Promise((resolve, reject) =>
			db.collection('widgets').find({}).toArray((err, data) =>
				err ? reject(err) : resolve(data))));

}).bind(database);

database.get = (function(widgetId) {

	return this.then(db =>
		new Promise((resolve, reject) =>
			db.collection('widgets').findOne({ _id: ObjectId(widgetId) }, (err, data) =>
				err ? reject(err) : resolve(data))));

}).bind(database);

database.insert = (function(widget) {

	return this.then(db => 
		new Promise((resolve, reject) =>
			db.collection('widgets').insertOne(widget, (err, data) =>
				err ? reject(err) : resolve(data.ops[0]))));	

}).bind(database);

module.exports = database;
