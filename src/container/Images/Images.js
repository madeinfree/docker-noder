import React from 'react';
import createRequest from '../../utils/createRequest';
import { compose, lifecycle, withState, withHandlers } from 'recompose';

const Images = ({ images, runImage, removeImage }) => (
  <div style={{ marginTop: 60 }}>
    <table className="table table-hover">
      <thead>
        <tr>
          <th className="text-center">REPOSITORY</th>
          <th className="text-center">TAG</th>
          <th className="text-center">IMAGE ID</th>
          <th className="text-center">CREATED</th>
          <th className="text-center">SIZE</th>
          <th className="text-center">OPTIONS</th>
        </tr>
      </thead>
      <tbody>
        {images ? (
          images.map((image, index) => (
            <tr key={`${image}-${index}`}>
              <td className="text-center">{image.REPOSITORY}</td>
              <td className="text-center">{image.TAG}</td>
              <td className="text-center">{`${image.IMAGE}${image.ID}`}</td>
              <td className="text-center">{image.CREATED}</td>
              <td className="text-center">{image.SIZE}</td>
              <td className="text-center">
                <button
                  onClick={() => runImage(`${image.IMAGE}${image.ID}`)}
                  className="btn btn-outline-success btn-sm"
                >
                  RUN
                </button>
                <button
                  onClick={() => removeImage(`${image.IMAGE}${image.ID}`)}
                  className="btn btn-outline-danger btn-sm"
                >
                  REMOVE
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>Loading Docker Images...</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default compose(
  withState('images', 'updateImages', []),
  lifecycle({
    componentDidMount() {
      createRequest({
        method: 'GET',
        url: '/images'
      }).then(response => {
        const data = response.data;
        this.props.updateImages(data);
      });
    }
  }),
  withHandlers({
    runImage: props => id => {
      createRequest({
        method: 'POST',
        url: '/images/run',
        data: {
          imageId: id
        }
      }).then(response => {
        const data = response.data;
        props.updateImages(data);
        alert(`啟動 ${id} 成功！`);
      });
    },
    removeImage: props => id => {
      createRequest({
        method: 'POST',
        url: '/images/remove',
        data: {
          imageId: id
        }
      }).then(response => {
        const data = response.data;
        props.updateImages(data);
        alert(`刪除 ${id} 成功！`);
      });
    }
  })
)(Images);
