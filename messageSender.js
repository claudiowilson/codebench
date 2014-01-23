var amqp = require('amqp'),
	settings = require('./settings'),
	sender = {};

(function() {
	
	var connection = amqp.createConnection( { url : settings.Rabbit.url }),
		exchange;
	
	connection.on('ready', function() {
		exchange = connection.exchange(settings.Rabbit.exchangeName);
	});

	var SendMessage = function(message, routingKey, callback) {
		if(exchange === null) return callback(new Error('exchange not defined!'));
		exchange.publish(routingKey, { message : message });
	};
	
	exports.SendMessage = SendMessage;
}());

