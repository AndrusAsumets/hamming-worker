const port = 6001;
let app = require('koa')();
let router = require('koa-router')();
let koaBody = require('koa-body')();
import request from 'request';
import neo4j from 'node-neo4j';
let db = new neo4j('localhost:7474');

import { worker } from './src/worker';

let host = 'http://127.0.0.1:6000';
let job = null;

router.post('/working', koaBody,
  function *(next) {
    console.log('/working')

    let response;

    if (!job) response = { status: 'available' }
    else response = { status: 'working' }

    this.type = 'application/json';
    this.body = response;
  }
);

router.post('/job', koaBody,
  function *(next) {
    console.log('/job');

    job = this.request.body;

    setTimeout(function() { 
      async function callWorker() {
        let message = await worker(job);

        if (message.error) {
          console.log(message.error);

          job = null;

          return;
        }
      
        request({ uri: host + '/complete', method: 'POST', json: job }, function (error, response, body) { job = null })
      }

      callWorker();

    }, 0);

    this.body = JSON.stringify(this.request.body);
  }
);

app.use(router.routes());

app.listen(port);

console.log('Worker is listening on', port);
