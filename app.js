require('dotenv').config();

let app = require('koa')();
let router = require('koa-router')();
let koaBody = require('koa-body')();
import request from 'request';

import { worker } from './src/worker';

let host = 'http://' + process.env.HEAD + ':6000' || 'localhost' + ':6000';
const port = 6001;
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

    let data = this.request.body;
    job = data.job;

    setTimeout(function() { 
      async function callWorker() {
        data.python = process.env.PYTHON || 'python'
        let message = await worker({ data: data });

        if (message.error) {
          console.log(message.error);

          job = null;

          return;
        }

        request({ uri: host + '/complete', method: 'POST', json: message.data }, function (error, response, body) { job = null })
      }

      callWorker();

    }, 0);

    this.body = JSON.stringify(this.request.body);
  }
);

app.use(router.routes());

app.listen(port);

console.log('Worker is listening on', port);
