'use strict';
const express = require('express');
const res = require('express/lib/response');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = parseInt(process.env.PORT) || 8080;

// Post image and return result URL
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

// get result for URL
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
});

module.exports = app;
