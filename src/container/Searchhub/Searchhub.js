import React from 'react';
import createRequest from '../../utils/createRequest';
import { compose, withState, withHandlers } from 'recompose';
import { Route, Link } from 'react-router-dom';

import Tags from '../Tags/Tags';

const SearchHub = ({
  match,
  onUpdateSearchQuery,
  onSubmitSearchQuery,
  searchResults
}) => (
  <div className="text-center" style={{ marginTop: 60 }}>
    查詢 hub.docker.com
    <div style={{ width: 500, margin: '0 auto' }} className="input-group">
      <input
        onChange={onUpdateSearchQuery}
        placeholder="node"
        className="form-control"
        type="text"
      />
      <button
        onClick={onSubmitSearchQuery}
        type="button"
        style={{ cursor: 'pointer' }}
        className="btn btn-primary"
      >
        搜尋
      </button>
    </div>
    <div>
      <table className="table">
        <thead>
          <tr>
            <th className="text-center">Repo Name</th>
            <th className="text-center">Short Description</th>
            <th className="text-center">Star Count</th>
            <th className="text-center">Pull Count</th>
            <th className="text-center">Repo Owner</th>
            <th className="text-center">Is Automated</th>
            <th className="text-center">Is Official</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((repoItem, index) => (
            <tr key={`${repoItem.repo_name}-${index}`}>
              <td className="text-center">
                <Link to={`/search-hub/${repoItem.repo_name}/tags`}>
                  {repoItem.repo_name}
                </Link>
              </td>
              <td className="text-center">{repoItem.short_description}</td>
              <td className="text-center">{repoItem.star_count}</td>
              <td className="text-center">{repoItem.pull_count}</td>
              <td className="text-center">{repoItem.repo_owner}</td>
              <td className="text-center">
                {repoItem.is_automated ? 'true' : 'false'}
              </td>
              <td className="text-center">
                {repoItem.is_official ? 'true' : 'false'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Route path="/search-hub/:namespace/:repo" component={Tags} />
  </div>
);

export default compose(
  withState('searchQuery', 'updateSearchQuery', ''),
  withState('searchResults', 'updateSearchResults', []),
  withHandlers({
    onUpdateSearchQuery: props => event => {
      const query = event.target.value;
      props.updateSearchQuery(query);
    },
    onSubmitSearchQuery: props => event => {
      const query = props['searchQuery'];
      createRequest({
        method: 'GET',
        url: `/search/${query}`
      }).then(response => {
        const data = response.data;
        props.updateSearchResults(data.results);
      });
    }
  })
)(SearchHub);
