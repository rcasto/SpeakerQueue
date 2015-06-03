var server = require('../server');

var port = process.env.PORT || 3000;

console.log("Using port: " + 3000);

server.listen(port, function () {
	console.log("Server started on port: " + port);
});