const express = require("express");
const winston = require("winston");
const dotenv = require("dotenv");

// Initialize express app
const app = express();

// Initialize environment variables
dotenv.config();

// Enable express to parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({format: process.env.TIMESTAMP_FORMAT}),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(log => `${log.timestamp} --- ${process.env.LOG_LEVEL} --- ${log.service} --- ${log.method} --- ${log.id} --- ${log.message} --- ${JSON.stringify(log.payload)}`)
  ),
  transports: [
    new winston.transports.File({filename: process.env.LOG_DIR + "/" + process.env.LOG_PREFIX + "-" + new Date().toISOString().split("T")[0] + process.env.LOG_EXTENSION})
  ]
});

app.post('/log', (req, res) => {
  var message = req.body.message;
  var id = (req.body.id) ? req.body.id : process.env.DEFAULT_ID;
  var payload = (req.body.payload) ? req.body.payload : process.env.DEFAULT_PAYLOAD;
  var service = (req.body.service) ? req.body.service : process.env.DEFAULT_SERVICE_NAME;
  var method = (req.body.method) ? req.body.method : process.env.DEFAULT_METHOD_NAME;
  var timestamp = (req.body.timestamp) ? req.body.timestamp : new Date().toLocaleString();
  logger.info({
    message: message, 
    payload: payload, 
    service: service,
    method: method,
    id: id
  });
  var response = {
    "status": "Success"
  };
  res.json(response);
});

var server = app.listen(process.env.APP_PORT, function () {
    console.log("Logger app running on port", server.address().port);
});
