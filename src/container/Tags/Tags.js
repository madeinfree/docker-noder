import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import createRequest from '../../utils/createRequest';
import Modal from 'react-modal';

const Tags = props => (
  <Modal
    style={{ overlay: { zIndex: 1030 } }}
    isOpen={true}
    onRequestClose={() => {
      props.history.push('/search-hub');
    }}
    closeTimeoutMS={0}
    shouldCloseOnOverlayClick={true}
    shouldReturnFocusAfterClose={true}
    role="dialog"
    ariaHideApp={false}
  >
    <h1 className="text-center">
      {props.match.params.namespace}/{props.match.params.repo === 'tags'
        ? 'office'
        : props.match.params.repo}{' '}
      Tags
    </h1>
    <div>
      <table className="table">
        <thead>
          <tr>
            <th className="text-center">Tag Name</th>
            <th className="text-center">Compressed Size</th>
            <th className="text-center">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {props.tags.map((tag, index) => (
            <tr key={`${tag.name}-${index}`}>
              <td className="text-center">{tag.name}</td>
              <td className="text-center">{tag.full_size}</td>
              <td className="text-center">{tag.last_updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Modal>
);

export default compose(
  withState('tags', 'updateTags', []),
  lifecycle({
    componentDidMount() {
      const { match, updateTags } = this.props;
      const params = match.params;
      if (params.repo === 'tags') {
        createRequest({
          method: 'GET',
          url: `/search/library/tags/${params.namespace}`
        }).then(response => {
          const data = response.data;
          updateTags(data.results);
        });
      } else {
        createRequest({
          method: 'GET',
          url: `/search/${params.namespace}/tags/${params.repo}`
        }).then(response => {
          const data = response.data;
          updateTags(data.results);
        });
      }
    }
  })
)(Tags);
