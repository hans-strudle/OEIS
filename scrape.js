'use strict'
var req = require('request'),
	fs = require('fs')
var x
var convert = require('./convert.js').transform
	
function grab(webAddr, seq, cb){
	req(webAddr, (err,res,txt)=>{
		console.log("Server Status Code: " + res.statusCode)
		x = res
		console.log("Multipart Bound: ", res.request._multipart.boundary, '\r\n')
		if (err) throw new Error(err)
		
		cb(txt, seq)
	})
}

var data = {},
	to = parseInt(process.argv[2]) || 100,
	count = 0
	

function scrp(i){
	var seq = 'A'
	for (var c = 0; c < 6 - i.toString().length;c++){
		seq += '0'
	}
	seq += i
	console.log("Scraping data for OEIS Sequence: " + seq)
	grab('http://oeis.org/search?q=id:' + seq + '&fmt=text', seq, (txt, seq)=>{
		
		fs.writeFile('seqs\\' + seq + '.txt', txt.trim(), (err)=>{
			if (err) console.log(err)
			data[seq] = convert(seq)
			console.log("Conversion of Seq: " + seq + " Succesful")
			if (i < to){
				scrp(i+1)
			} else {
				fs.writeFileSync('MASTER.json', JSON.stringify(data))
			}
		})
	})
}

scrp(1)