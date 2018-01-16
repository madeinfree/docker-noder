const express = require('express');

const { exec } = require('child_process');
const shellParser = require('node-shell-parser');
const axios = require('axios');

const searchhubRouter = () => {
  const router = express.Router();

  router.get('/search/:q', (req, res) => {
    const { q } = req.params;
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `https://hub.docker.com/v2/search/repositories/?query=${q}`
    }).then(response => {
      const data = response.data;
      res.status(200).send(data);
    });
  });

  router.get('/search/library/tags/:repo', (req, res) => {
    const { repo } = req.params;
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `https://hub.docker.com/v2/repositories/library/${repo}/tags?page=1&page_size=250`
    }).then(response => {
      const data = response.data;
      res.status(200).send(data);
    });
  });

  router.get('/search/:namespace/tags/:repo', (req, res) => {
    const { namespace, repo } = req.params;
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `https://hub.docker.com/v2/repositories/${namespace}/${repo}/tags?page=1&page_size=250`
    }).then(response => {
      const data = response.data;
      res.status(200).send(data);
    });
  });

  return router;
};

exports.default = searchhubRouter;
