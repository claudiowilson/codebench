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
            queue.subscribe(function(message, headers, props, m) {
                var correlationId = m.correlationId;
                if (correlationId in requests) {
                    var callback = self.requests[correlationId].callback;
                    delete self.eequests[correlationId];
                    callback(null, message);
                }
            });
            console.log("queue declared!");
        });
    });
    
    var SendMessage = function(message, routingKey, callback) {
	if(exchange === null) return callback(new Error('exchange not defined!'));
	exchange.publish(routingKey,  message, { correlationId: message, replyTo: routingKey });
        requests[correlationId] = { callback:callback };
//	callback(null, "Sent " + message);
    };
	
    exports.SendMessage = SendMessage;
}());

