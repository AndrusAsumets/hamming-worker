var request = require('sync-request');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var neo4j = require('node-neo4j');
var db = new neo4j('http://188.166.74.20:7474');

export function query(options) {
	return new Promise(function(resolve, reject) {
			const data = options.data;
			let unsorted = [];



		  for (let i = 0; i < data.length; i++) { 
		  	console.log('foo2');
			  var query = "MATCH (meta {meta: '" + data[i].element + "'}) RETURN meta";

			  db.cypherQuery(query, function(error, result) {
			      if(!error) unsorted.push(data[i]);

			      if (i == data.length - 1) console.log(JSON.stringify(result, null, 4))

			      //resolve({error: null, data: unsorted });
			  });
		  }
	});
}