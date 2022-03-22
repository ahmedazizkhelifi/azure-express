'use strict';
const express = require('express');
const res = require('express/lib/response');
const request = require('request');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const key = '4cfaa015242b40b1bcf8680f2b8bcb99';
const imgURL =
  'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/contoso-allinone.jpg';
const endpoint = 'https://cho-app.cognitiveservices.azure.com';

const predict = (key, imgURL, endpoint) => {
  var headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': key,
  };
  var dataString = `{'source': '${imgURL}'}`;
  var options = {
    url: `${endpoint}/formrecognizer/v2.1/layout/analyze?includeTextDetails=true&locale=en-US`,
    method: 'POST',
    headers: headers,
    body: dataString,
  };
  function callback(error, response, body) {
    if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
      console.log(response.caseless.dict['operation-location']);
      return response.caseless.dict['operation-location'];
    } else {
      return -1;
    }
  }
  request(options, callback);
};

const url =
  'https://cho-app.cognitiveservices.azure.com/formrecognizer/v2.1/layout/analyzeResults/7ac80b32-9992-464f-ad4e-5e76dfa88ab9';
const p = (url) => {
  var headers = {
    'Ocp-Apim-Subscription-Key': '4cfaa015242b40b1bcf8680f2b8bcb99',
  };

  var options = {
    url: url,
    headers: headers,
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  }

  request(options, callback);
};
//predict(key, imgURL, endpoint);
//p(url);

const PORT = parseInt(process.env.PORT) || 8080;

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/predict', (req, res) => {
  var headers = {
    'Ocp-Apim-Subscription-Key': req.body.key,
  };

  var options = {
    url: req.body.url,
    headers: headers,
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.status(200).send({ statusCode: 200, response: JSON.parse(body) });
    }
  }

  request(options, callback);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

app.post('/predict', (req, res) => {
  var headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': req.body.key,
  };
  var dataString = `{'source': '${req.body.imgURL}'}`;
  var options = {
    url: `${req.body.endpoint}/formrecognizer/v2.1/layout/analyze?includeTextDetails=true&locale=en-US`,
    method: 'POST',
    headers: headers,
    body: dataString,
  };
  function callback(error, response, body) {
    if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
      console.log(response.caseless.dict['operation-location']);
      res
        .status(200)
        .send({
          statusCode: 200,
          url: response.caseless.dict['operation-location'],
        })
        .end();
    } else {
      res.status(404).send({ statusCode: 404, message: 'erreur' }).end();
    }
  }
  request(options, callback);
});

module.exports = app;
