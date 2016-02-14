let app = require('koa')();
let router = require('koa-router')();
let koaBody = require('koa-body')();
import request from 'request';

import { worker } from './src/worker';

const port = 6001;
let job = null;

router.post('/working', koaBody,
  function *(next) {
    console.log('/working');

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

    let data = this.request.body;
    job = data.job;
    const host = data.host;

    setTimeout(function() { 
      async function callWorker() {
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
