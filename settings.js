var PgConnString = "postgres://postgres:yoloswag@localhost:5432/codebench";

var Rabbit = { url : "amqp://guest:guest@localhost:5672",
		exchangeName : "codebench" };
//var PgConnString = "postgres://claudiowilson:claudiowilson@localhost:5432/codebench"
//var PgConnString = "postgres://kyeh:yoloswag@localhost:5432/codebench"
exports.PgConnString = PgConnString;
exports.Rabbit = Rabbit;
exports.NumContainers = 10;
