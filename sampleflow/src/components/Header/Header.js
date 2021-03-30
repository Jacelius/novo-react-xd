import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/img/nn_logo_rgb_white.svg';

function Header() {
  return (
    <div className="header">
    <nav className="main-nav">
      <ul>
        <Link to="/">
          <h1 className="title">Sampleflow Analytics</h1>
        </Link>
        <Link to="/">
          <img className="logo" src={Logo}/>
        </Link>
      </ul>
    </nav>
    </div>
  );
}

export default Header;