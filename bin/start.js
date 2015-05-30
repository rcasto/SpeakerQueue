var server = require('../server');

var port = 3000;

server.listen(port, function () {
	console.log("Server started on port: " + port);
});