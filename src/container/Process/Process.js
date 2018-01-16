import React from 'react';
import createRequest from '../../utils/createRequest';
import { compose, lifecycle, withHandlers, withState } from 'recompose';

const Process = ({
  process,
  stopProcess,
  startProcess,
  restartProcess,
  removeProcess
}) => (
  <div style={{ marginTop: 60 }}>
    <table className="table table-hover">
      <thead>
        <tr>
          <th className="text-center">CONTAINER ID</th>
          <th className="text-center">IMAGE</th>
          <th className="text-center">COMMAND</th>
          <th className="text-center">CREATED</th>
          <th className="text-center">STATUS</th>
          <th className="text-center">PORTS</th>
          <th className="text-center">NAMES</th>
          <th className="text-center">OPTIONS</th>
        </tr>
      </thead>
      <tbody>
        {process ? (
          process.map((proc, index) => (
            <tr key={`${proc}-${index}`}>
              <td className="text-center">{`${proc.CONTAINER}${proc.ID}`}</td>
              <td className="text-center">{proc.IMAGE}</td>
              <td className="text-center">{proc.COMMAND}</td>
              <td className="text-center">{proc.CREATED}</td>
              <td className="text-center">{proc.STATUS}</td>
              <td className="text-center">{proc.PORTS}</td>
              <td className="text-center">{proc.NAMES}</td>
              <td className="text-center">
                {proc.STATUS.includes('Exited') ? (
                  <div>
                    <button
                      onClick={() =>
                        startProcess(`${proc.CONTAINER}${proc.ID}`)
                      }
                      className="btn btn-outline-success btn-sm"
                    >
                      START
                    </button>
                    <button
                      onClick={() =>
                        removeProcess(`${proc.CONTAINER}${proc.ID}`)
                      }
                      className="btn btn-outline-danger btn-sm"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() =>
                        restartProcess(`${proc.CONTAINER}${proc.ID}`)
                      }
                      className="btn btn-outline-success btn-sm"
                    >
                      RESTART
                    </button>
                    <button
                      onClick={() => stopProcess(`${proc.CONTAINER}${proc.ID}`)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      STOP
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>Loading Docker Process...</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default compose(
  withState('process', 'updateProcess', []),
  lifecycle({
    componentDidMount() {
      createRequest({
        method: 'GET',
        url: '/ps'
      }).then(response => {
        const data = response.data;
        this.props.updateProcess(data);
      });
    }
  }),
  withHandlers({
    stopProcess: props => id => {
      createRequest({
        method: 'POST',
        url: '/ps/stop',
        data: {
          processId: id
        }
      }).then(response => {
        const data = response.data;
        props.updateProcess(data);
      });
    },
    startProcess: props => id => {
      createRequest({
        method: 'POST',
        url: '/ps/start',
        data: {
          processId: id
        }
      }).then(response => {
        const data = response.data;
        const error = data.source;
        if (error) {
          return alert(`
            錯誤執行指令：${error.cmd}\n
            錯誤原因：${data.message.trim()}`);
        }
        props.updateProcess(data);
        alert(`啟動 ${id} 成功！`);
      });
    },
    restartProcess: props => id => {
      createRequest({
        method: 'POST',
        url: '/ps/restart',
        data: {
          processId: id
        }
      }).then(response => {
        const data = response.data;
        const error = data.source;
        if (error) {
          return alert(`
            錯誤執行指令：${error.cmd}\n
            錯誤原因：${data.message.trim()}`);
        }
        props.updateProcess(data);
        alert(`重啟 ${id} 成功！`);
      });
    },
    removeProcess: props => id => {
      createRequest({
        method: 'POST',
        url: '/ps/remove',
        data: {
          processId: id
        }
      }).then(response => {
        const data = response.data;
        const error = data.source;
        if (error) {
          return alert(`
            錯誤執行指令：${error.cmd}\n
            錯誤原因：${data.message.trim()}`);
        }
        props.updateProcess(data);
        alert(`刪除 ${id} 成功！`);
      });
    }
  })
)(Process);
