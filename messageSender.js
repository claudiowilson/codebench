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
                var correlationId = props.correlationId;
                if (correlationId in requests) {
                    console.log(requests[correlationId]);
                    var callback = requests[correlationId].callback;
                    delete requests[correlationId];
                    callback(null, message.data.toString());
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
    };
	
    exports.SendMessage = SendMessage;
}());

