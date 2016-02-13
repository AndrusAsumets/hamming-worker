var db = new neo4j('localhost:7474');
var request = require('sync-request');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

export function worker(data) {
	return new Promise(function(resolve, reject) {
		var element;
		var url;

		//json strings
		var album_type;
		var available_markets;
		var external_urls;
		var href;
		var id;
		var images;
		var name;
		var type;
		var uri;
		var imagePath;

		element = data.job;

		try {
			album_type = element.album_type;
			available_markets = element.available_markets;
			external_urls = element.external_urls;
			href = element.href;
			id = element.id;
			images = element.images;
			name = element.name;
			type = element.type;
			uri = element.uri;
			url = images[0].url;
			imagePath = path.resolve(__dirname.split('/src').join('/') + '/data/images/' + id + '.jpg');
		} catch(err) {
			return resolve({ error: true });
		}

		console.log(url);

		var res = request('GET', url);
		var contents = fs.writeFileSync(imagePath, res.getBody());

		var child = exec('python3 classify_image.py --image_file ' + imagePath);

		/*
		child.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});
		*/

		child.stdout.on('data', function(data) {
			console.log(data);
			//fs.unlinkSync(imagePath);

			var results = JSON.parse(data);
			results.forEach(result => {
				var value = parseFloat(result.shift());
				result = result.toString().split(',');

				var j = 0;
				result.forEach(element => {
					element = element.replace(/(^\s+|\s+$)/g, '');
					element = element.split(' ').join('_');
					element = element.replace(/[^a-zA-Z0-9\s!?]+/g, '');

					saveMeta(value, element);
				});
			});
		});

		function saveMeta(value, element) {
		  var query = "CREATE (" + element + ":Meta {meta:'" + element + "',album_type:'" + album_type + "',available_markets:'" + available_markets + "',external_urls:'" + external_urls + "',href:'" + href + "',id:'" + id + "',images:'" + images + "',name:'" + name + "',type:'" + type + "',uri:'" + uri + "',value:'" + value + "'})";

			db.cypherQuery(query, function(err, result) {
			    if(err) console.log(err);
			    console.log(element, value);

			    resolve({error: null, data: data });
			});
		}
	});
}

