(function() {
	var amqp = require('amqp'),
		settings = require('./settings'),
		connection = amqp.createConnection( { url : settings.Rabbit.url }),
		exchange = null;

	connection.on('ready', function() {
		options = { autoDelete : false };
		exchange = connection.exchange(settings.Rabbit.exchangeName,options, function() {
			console.log("exchange declared!");
		});
	});

	var SendMessage = function(message, routingKey, callback) {
		if(exchange === null) return callback(new Error('exchange not defined!'));
		exchange.publish(routingKey,  message);
		callback(null, "Sent " + message);
	};
	
	exports.SendMessage = SendMessage;
}());

