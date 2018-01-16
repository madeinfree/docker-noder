import React from 'react';
import { compose, lifecycle, withStateHandlers, withHandlers } from 'recompose';
import io from 'socket.io-client';

let socket;
let socketIsBind = false;

const logsBoardStyle = {
  borderRadius: 5,
  margin: '0 auto',
  marginTop: 50,
  overflow: 'auto',
  width: 1200,
  height: 500,
  backgroundColor: '#000',
  color: 'green'
};

const Pullhub = ({
  pullImage,
  sendCommand,
  onChangeName,
  onChangeCommand,
  name,
  logs,
  action
}) => (
  <div style={{ marginTop: 60 }}>
    Image Name: <input onChange={onChangeName} type="text" />
    <button onClick={() => pullImage(name)} className="btn btn-success">
      {action !== 'pulling' ? 'Pull' : 'Pulling...'}
    </button>
    <div>
      <div style={logsBoardStyle}>
        <pre style={{ color: 'green', padding: 20 }}>{logs}</pre>
      </div>
      <div style={{ margin: '0 auto', marginTop: 10, width: 1200 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div>docker</div>
          <input
            onChange={onChangeCommand}
            className="form-control"
            style={{ width: 1200 }}
            placeholder="command..."
            type="text"
          />
          <button
            onClick={sendCommand}
            className="btn btn-success"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default compose(
  withStateHandlers(
    { name: '', logs: '', action: '', command: '' },
    {
      onChangeName: ({ name }) => event => ({ name: event.target.value }),
      onChangeLogs: ({ logs }) => msg => ({
        logs: logs + '\n$ ' + msg
      }),
      onChangeCommand: ({ command }) => event => ({
        command: event.target.value
      }),
      onClearLogs: _ => _ => ({ logs: '' }),
      onPullingImage: _ => _ => ({ action: 'pulling' }),
      onPullingImageEnd: _ => _ => ({ action: 'Idel' })
    }
  ),
  withHandlers({
    pullImage: props => name => {
      props.onPullingImage();
      socket.send(
        JSON.stringify({
          action: 'pull-image',
          imageName: name
        })
      );
    },
    sendCommand: props => _ => {
      socket.send(
        JSON.stringify({
          action: 'docker-command',
          command: props.command
        })
      );
    }
  }),
  lifecycle({
    componentDidMount() {
      socket = io('http://localhost:8990');
      socketIsBind = false;
      if (!socketIsBind) {
        socket.on('message', msg => {
          if (msg === 'pull end') {
            return this.props.onPullingImageEnd();
          }
          socketIsBind = true;
          this.props.onChangeLogs(msg);
        });
      }
    },
    componentWillUnmount() {
      socket.close();
    }
  })
)(Pullhub);
