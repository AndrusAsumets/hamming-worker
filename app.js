let app = require('koa')();
let router = require('koa-router')();
let koaBody = require('koa-body');
import request from 'request';

import { spotify } from './src/spotify';
import { user } from './src/user';

const port = 6001;
let job = null;

router.post('/status', koaBody(),
  function *(next) {
    console.log('/status');

    let response;

    if (!job) response = { status: 'available' }
    else response = { status: 'working' }

    this.type = 'application/json';
    this.body = response;
  }
);

router.post('/spotify', koaBody(),
  function *(next) {
    let data = this.request.body;
    job = data.job;
    const host = data.host;

    setTimeout(function() { 
      async function callWorker() {
        let message = await spotify({ data: data });

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

router.post('/user', koaBody({
    jsonLimit: '10mb'
  }),
  function *(next) {
    console.log('/user');

    let data = this.request.body;
    job = data.job;
    const host = data.host;

    setTimeout(function() { 
      async function callWorker() {
        let message = await user({ data: data });

        if (message.error) {
          console.log(message.error);

          job = null;

          return;
        }

        console.log('success');

        request({ uri: host + '/complete', method: 'POST', json: message.options }, function (error, response, body) { job = null })
      }

      callWorker();

    }, 0);

    this.body = JSON.stringify(this.request.body);
  }
);

app.use(router.routes());

app.listen(port);

console.log('Worker is listening on', port);