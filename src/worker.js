var request = require('sync-request');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

export function worker(options) {
	return new Promise(function(resolve, reject) {
		console.log(options);
		let python = options.data.python;
		let element = options.data.job;
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

		var child = exec(python + ' classify_image.py --image_file ' + imagePath);

		/*
		child.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});
		*/

		child.stdout.on('data', function(data) {
			fs.unlinkSync(imagePath);

			var response = []

			var results = JSON.parse(data);
			results.forEach(result => {
				var value = parseFloat(result.shift());
				result = result.toString().split(',');

				var j = 0;
				result.forEach(element => {
					element = element.replace(/(^\s+|\s+$)/g, '');
					element = element.split(' ').join('_');
					element = element.replace(/[^a-zA-Z0-9\s!?]+/g, '');

					response.push({ value: value, element: element });
				});
			});

			options.result = response;

			resolve({error: null, data: options });
		});
	});
}

