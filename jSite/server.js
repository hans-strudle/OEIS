'use strict';
var http = require('http'),
	fs = require('fs');
	
const PORT = 8080;
var JSONdata;

fs.readFile(process.argv[2], function(err, data){
	if (err) throw new Error(error);
	JSONdata = JSON.parse(data); // convert from str to JSON obj
})

function handleReq(request, response){
	var body;
	if (request.url.indexOf('favicon') > -1){
		return;
	}
	response.write('<style>.key{color:red}</style>')
	
	var tree = request.url.split('/');
	console.log(tree);
	var currData;
	tree.forEach(function(e){
		currData = currData || JSONdata; // if its the first time it will be equal to JSONdata
		if (e != ''){
			console.log(e);
			currData = currData[e];
		}
	})
	response.write(JSONtoHTML(currData || JSONdata));
	
	console.log('Connection from ', request.connection.remoteAddress);
	request.on('data', function(chunk){
		body += chunk;
	})
	request.on('end', function(){
		console.log('Post Data: ', body);
		body = '';
	})
	response.end('');
}

var server = http.createServer(handleReq);

server.listen(PORT, function(){
	console.log('Server on ', PORT);
})

function JSONtoHTML(o){ // o is JSON object
	var HTML = '';
	for (var key in o){
		HTML += '<div class="entry">'
		switch (typeof o[key]){
			case ('string'):
				HTML += '<span class="key str">' + key + ': </span><span class="value str">' + 
				o[key] + '</span>';
				break;
			case ('object'):
				HTML += '<a class="key obj" href="' + key + '/">' + key + '</a>';
				break;
			case ('number'):
				HTML += '<span class="key num">' + key + ': </span><span class="value num">' + 
				o[key] + '</span>';
				break;
			default:
				HTML += '<span class="key">' + key + ': </span><span class="value">' + 
				o[key] + '</span>';
		}
		HTML += '</div>'
	}
	return HTML;
}