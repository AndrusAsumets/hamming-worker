var request = require('sync-request');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var neo4j = require('node-neo4j');
var db = new neo4j('http://188.166.74.20:7474');

import { query } from './query';

export function user(options) {
	return new Promise(function(resolve, reject) {
		const url = options.data.job;
		const data = options.data.data;
		const imagePath = __dirname.split('/src').join('/') + 'data/images' + url.split('/data/images')[1];

		fs.writeFileSync(imagePath, data, 'base64');

		var child = exec('python classify_image.py --image_file ' + imagePath);

		child.stdout.on('data', async function(data) {

			var response = [];
			var results = JSON.parse(data);
			results.forEach(result => {
				var value = parseFloat(result.shift());
				result = result.toString().split(',');

				var j = 0;
				result.forEach(element => {
					element = element.replace(/(^\s+|\s+$)/g, '');
					element = element.split(' ').join('_');
					element = element.replace(/[^a-zA-Z0-9\s!?]+/g, '');

					console.log(value, element);

					response.push({ element: element, value: value });
				});
			});

			let message = await query({ data: response });

			console.log(message);


			resolve({error: null, options: options });
		});

		function getMeta(value, element) {
		  var query = "MATCH (meta {meta: '" + element + "'}) RETURN meta";

		  db.cypherQuery(query, function(err, result) {
		      if(err) console.log(err);
		      console.log(element, value);
		  });
		}
	});
}