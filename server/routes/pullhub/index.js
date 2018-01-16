const express = require('express');

const { exec } = require('child_process');
const shellParser = require('node-shell-parser');

const io = require('socket.io')(8990);

io.on('connection', socket => {
  socket.on('message', msg => {
    const parseMsg = JSON.parse(msg);
    const action = parseMsg.action;
    let pull;
    switch (action) {
      case 'pull-image':
        const imageName = parseMsg.imageName;
        pull = exec(`docker pull ${imageName}`);
        break;
      case 'docker-command':
        const command = parseMsg.command;
        pull = exec(`docker ${command}`);
        break;
    }
    pull.stdout.on('data', chunk => {
      console.log('[Socket Server Logs]:' + chunk);
      socket.send(chunk);
    });
    pull.stderr.on('data', chunk => {
      console.log('[Socket Server Logs]:' + chunk);
      socket.send(chunk);
    });
    pull.stdout.on('end', _ => {
      console.log('[Socket Server Logs]: image pull end');
      socket.send('pull end');
    });
  });
  socket.on('disconnect', so => {});
});

const pullhubRouter = props => {
  const router = express.Router();
  return router;
};

exports.default = pullhubRouter;
