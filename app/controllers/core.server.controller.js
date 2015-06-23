'use strict';

var events = require('events');
var eventEmitter = new events.EventEmitter();

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

/**
 * Connect to sse
 */
exports.sse_connect = function(req, res) {
	var sse = startSees(res);
	eventEmitter.on('Chat', sendChat)
    
    console.log("New connection : ", req.params.uid);

  	req.once("end", function() {
    	eventEmitter.removeListener("Chat", sendChat);
    	console.log("Remove connection : ", req.params.uid);
  	});

  	req.on("close", function() {
    	eventEmitter.removeListener("Chat", sendChat);
    	console.log("Remove connection onClose : ", req.params.uid);  
  	});
       
    function sendChat(msg, users) {
      console.log("sendChat's users : ", users);
      if (users.indexOf(req.params.uid) >= 0 ){
        sse("chat", msg);
      }
  	}
}

/**
 * Send message to all connection
 */
exports.sse_sendMsg = function(data, users){
	eventEmitter.emit('Chat', data, users);
}

/**
 * Start SSE connection
 */
function startSees(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  return function sendSse(name,data,id) {
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}