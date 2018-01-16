const express = require('express');

const { exec } = require('child_process');
const shellParser = require('node-shell-parser');

const getDockerProcess = () =>
  new Promise(resolve => {
    exec('docker ps -a', (err, stdout, stderr) => {
      const parser = shellParser(stdout);
      resolve(parser);
    });
  });

const ProcessRouter = () => {
  const router = express.Router();
  router.get('/ps', (req, res) => {
    getDockerProcess().then(result => {
      res.status(200).send(result);
    });
  });

  router.post('/ps/start', (req, res) => {
    const { processId } = req.body;
    exec(`docker start ${processId}`, (err, stdout, stderr) => {
      if (err)
        return res.status(200).send({
          message: stderr,
          source: err
        });
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  router.post('/ps/restart', (req, res) => {
    const { processId } = req.body;
    exec(`docker restart ${processId}`, (err, stdout, stderr) => {
      if (err)
        return res.status(200).send({
          message: stderr,
          source: err
        });
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  router.post('/ps/stop', (req, res) => {
    const { processId } = req.body;
    exec(`docker stop ${processId}`, (err, stdout, stderr) => {
      if (err)
        return res.status(200).send({
          message: stderr,
          source: err
        });
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  router.post('/ps/remove', (req, res) => {
    const { processId } = req.body;
    exec(`docker rm ${processId}`, (err, stdout, stderr) => {
      if (err)
        return res.status(200).send({
          message: stderr,
          source: err
        });
      getDockerProcess().then(result => {
        res.status(200).send(result);
      });
    });
  });

  return router;
};

exports.default = ProcessRouter;
