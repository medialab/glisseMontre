/**
 *
 * Viewer404
 *
 */

import * as React from 'react';

import logo from './assets/logo.svg';

import './style.css';

interface Props {
  URL?: string;
}
const Viewer404: React.SFC<Props> = (props) => {
  return (
    <div className="viewer404-container">
      <div className="viewer404-content">
        <a
          className="title is-1 viewer404-title-container"
          href="https://medialab.github.io/tesselle"
          target="blank"
          rel="noopener"
        >
            <img className="logo" src={logo} />
            <span className="app-name">Tesselle</span>
        </a>
        <div className="content">
          {'The data you are trying to access with '}
          <a href="https://medialab.github.io/tesselle" target="blank" rel="noopener">Tesselle</a>
          {props.URL ? ` does not exist (anymore ?) at the address ${props.URL}.` : ' does not exist (anymore ?).'}
        </div>
      </div>
    </div>
  );
};

export default Viewer404;
