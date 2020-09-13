import React from 'react';

import { useSiteMetadata } from 'hooks';

import Container from 'components/Container';

const Footer = () => {
  const { authorName, authorUrl, version } = useSiteMetadata();

  return (
    <footer className="footer-component has-text-danger">
      <Container>
        <p>
          &copy; { new Date().getFullYear() }, <a href={authorUrl}>{ authorName }</a>. Version {version}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
