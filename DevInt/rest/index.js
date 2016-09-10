'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const { webServer: webServerConfig } = require('./package.json');

const app = express();

app.use(cors());

app.use('/api/widgets', bodyParser.json(), router);

const server = http.createServer(app);

server.listen(webServerConfig.port, function() {
	console.log(`listening on port ${webServerConfig.port}`);
});