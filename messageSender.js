(function() {
	var amqp = require('amqp'),
		settings = require('./settings'),
		connection = amqp.createConnection( { url : settings.Rabbit.url }),
		exchange = null;

	connection.on('ready', function() {
		exchange = connection.exchange(settings.Rabbit.exchangeName);
	});

	var SendMessage = function(message, routingKey, callback) {
		if(exchange === null) return callback(new Error('exchange not defined!'));
		exchange.publish(routingKey, { message : message });
	};
	
	exports.SendMessage = SendMessage;
}());

