import React from 'react';

import { useSiteMetadata } from 'hooks';

const Header = () => {
  const { companyName, companyUrl } = useSiteMetadata();

  return (
    <nav className="navbar is-danger is-fixed-top" style={{zIndex: 999}} role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href={companyUrl}>
          {companyName}
        </a>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
    </nav>

  );
};

export default Header;
