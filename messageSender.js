(function() {
    var amqp = require('amqp'),
    settings = require('./settings'),
    connection = amqp.createConnection( { url : settings.Rabbit.url }),
    exchange = null,
    requests = {},
    queue = null;

    connection.on('ready', function() {
	options = { autoDelete : false };
	exchange = connection.exchange(settings.Rabbit.exchangeName,options, function() {
	    console.log("exchange declared!");
	});
        connection.queue('', options, function(q) {
            queue = q.name;
            q.subscribe(function(message, headers, props, m) {
                var correlationId = m.correlationId;
                if (correlationId in requests) {
                    var callback = requests[correlationId].callback;
                    delete requests[correlationId];
                    callback(null, message);
                }
            });
            console.log("queue declared!");
        });
    });
    
    var SendMessage = function(message, routingKey, callback) {
	if(exchange === null) return callback(new Error('exchange not defined!'));
        var correlationId = String(message);
	exchange.publish(routingKey,  message, { correlationId: correlationId, replyTo: queue });
        requests[correlationId] = { callback:callback };
	callback(null, "Sent " + message);
    };
	
    exports.SendMessage = SendMessage;
}());

