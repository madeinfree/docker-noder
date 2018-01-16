const express = require('express');

const { exec } = require('child_process');
const shellParser = require('node-shell-parser');

const getDockerProcess = () =>
  new Promise(resolve => {
    exec('docker images', (err, stdout, stderr) => {
      const parser = shellParser(stdout);
      resolve(parser);
    });
  });

const ImagesRouter = () => {
  const router = express.Router();
  router.get('/images', (req, res) => {
    exec('docker images', (err, stdout, stderr) => {
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  router.post('/images/run', (req, res) => {
    const { imageId } = req.body;
    exec(`docker run ${imageId}`, (err, stdout, stderr) => {
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  router.post('/images/remove', (req, res) => {
    const { imageId } = req.body;
    exec(`docker rmi ${imageId}`, (err, stdout, stderr) => {
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  return router;
};

exports.default = ImagesRouter;
