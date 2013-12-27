var cwd = process.cwd();
var io = require('socket.io-client');
var clients = require(cwd + "/app/script/clients.js");
	
var socket = null;
	
var ActFlagType = {
	AUTH: 0,
	LOGOUT: 1,
	SYNC: 2,
	P2P: 3,
};

/*initialize connection to server side*/
init = function(host, port){
	var url = 'https://' + host + ':' + port;
	socket = io.connect(url,{secure:true, transports: ['websocket'],'force new connection':true, reconnect:true, 'try multiple transports':false});

	socket.on('connect', function(){
		console.log('socket connect!');
		auth();
	});
		
	socket.on('reconnect', function(){
		console.log('reconnect');
	});

	//receive socket message
	socket.on('message', function(data){
		//console.log(data);
		var json = JSON.parse(data);
		var sid = json.sid;
		var cid = json.cid;
		var code = json.code;
		if(sid == 90 && cid == 34 && code == 200){
			console.log('login success ' + offset);
		}else if( code != 200){
			recvError();
			console.log(data);
		}

	});
		
		//encounter connection error
	socket.on('error', function(err){
		console.log('connect error: ' + err);
	});

	socket.on('disconnect', function(reason){
		console.log('disconnect ' + reason);
	});
};
	

/*
 record request type, name
 */
var monitor = function(type, name, reqId) {
	if (typeof actor !== 'undefined'){
		actor.emit(type, name, reqId);
	} else {
		console.error(Array.prototype.slice.call(arguments, 0));
	}
	}
	
var host = '192.168.164.84';
var port = 9092;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var offset = (typeof actor !== 'undefined') ? actor.id : 1;
var uid = clients(offset);
console.log('offset: ' + offset + "  uid: " + uid);

init(host, port);

function auth(){
	var msg = '{"SID":90,"CID":34,"Q":[ {"t":"string","v":"{\\"uid\\":' 
		+ uid 
		+ ',\\"url\\":\\"vvvvvvvvvvvvvv\\"}"},{"t":"property","v":{"9":"80"}} ]}';
	console.log(msg);
	socket.send(msg);
}

function recvError()
{
	monitor('incr', 'Error');
}

process.on('uncaughtException', function(err){
	console.error('Caught exception: ' + err.stack);	
});
