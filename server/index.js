const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const ImageRouter = require('./routes/images/').default;
const ProcessRouter = require('./routes/process/').default;
const PullhubRouter = require('./routes/pullhub/').default;
const SearchhubRouter = require('./routes/searchhub/index').default;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  '/api/docker/',
  ImageRouter(),
  ProcessRouter(),
  PullhubRouter(),
  SearchhubRouter()
);

app.listen(8980, () => console.log('Nodejs Docker listening on port 8980'));
