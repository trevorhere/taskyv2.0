const express = require('express');
const path = require('path');
const app = require('./server/server');
const bodyParser = require('body-parser');
const parser = require('./sms/parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const port = process.env.PORT || 4000;

app.get('/sms', (req, res) => {
  console.log('sms get hit');

  parser.parse(req,res);

});

app.post('/sms', (req, res) => {
  console.log('sms post hit');
  parser.parse(req,res);

});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
