var fs = require('fs')

var conv = {
	'%A': {'t': 'author', 's': 'str'},
	'%C': {'t': 'comments', 's': 'str'},
	'%D': {'t': 'references', 's': 'arr'},
	'%E': {'t': 'extensions', 's': 'arr'},
	'%F': {'t': 'formula', 's': 'str'},
	'%H': {'t': 'links', 's': 'arr'},
	'%I': {'t': 'formerly', 's': 'str'},
	'%K': {'t': 'keyword', 's': 'str'},
	'%N': {'t': 'description', 's': 'str'},
	'%O': {'t': 'offset', 's': 'str'},
	'%S': {'t': 'seq', 's': 'str'},
	'%T': {'t': 'seq', 's': 'str'},
	'%U': {'t': 'seq', 's': 'str'},
	'%V': {'t': 'seq', 's': 'str'},
	'%W': {'t': 'seq', 's': 'str'},
	'%X': {'t': 'seq', 's': 'str'},
	'%Y': {'t': 'crossrefs', 's': 'arr'},
	'%o': {'t': 'prog', 's': 'str'},
	'%t': {'t': 'mathematica', 's': 'str'},
	'%p': {'t': 'maple', 's': 'str'},
	'%e': {'t': 'example', 's': 'str'}
}

exports.transform = function (seq){
	var file = fs.readFileSync('seqs\\' + seq + '.txt', 'utf8')
	var lines = file.split('\n')
	var data = {}

	lines.forEach((e,i,a)=>{
		e = e.replace(seq, '')
		
		var type = conv[e.substr(0,2)]
		if (typeof type !== 'undefined'){
			if (type.s == 'arr'){
				data[type.t] = data[type.t] || []
				data[type.t].push(e.substr(4,e.length))
			}
			if (type.s == 'str'){
				data[type.t] = data[type.t] || ''
				data[type.t] += e.substr(4,e.length)
			}
		} else if (e[0] == '%'){
			fs.appendFileSync('error.txt', seq + ' : ' + e[0] + e[1] + ' found, not in conv\n')
		}
		
		fs.writeFileSync('json\\' + seq + '.json', JSON.stringify(data))
		
	})
	return data
}


