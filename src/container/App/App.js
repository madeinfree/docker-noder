import React from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Images from '../Images/Images';
import Process from '../Process/Process';
import Pullhub from '../Pullhub/Pullhub';
import Searchhub from '../Searchhub/Searchhub';

const App = () => (
  <Router>
    <div>
      <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top">
        <Link className="navbar-brand" to="/">
          ReactJS Docker UI
        </Link>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <div className="collapse navbar-collapse">
              <Link className="nav-link" to="/images">
                Images
              </Link>
              <Link className="nav-link" to="/process">
                Process
              </Link>
              <Link className="nav-link" to="/search-hub">
                SearchHub
              </Link>
              <Link className="nav-link" to="/pull-hub">
                PullHub
              </Link>
            </div>
          </li>
        </ul>
      </nav>
      <Route path="/images" component={Images} />
      <Route path="/process" component={Process} />
      <Route path="/pull-hub" component={Pullhub} />
      <Route path="/search-hub" component={Searchhub} />
      <div
        className="text-center"
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 60,
          lineHeight: '60px',
          backgroundColor: '#f5f5f5'
        }}
      >
        Create By Whien_Liou
      </div>
    </div>
  </Router>
);

export default App;
