//This is the main layout of the web app, creates margins and centers content.
import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar.js';

export default (props) => {
  return (
    <Container className="MainContainer">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
        <script src="//d3js.org/d3.v3.min.js"></script>
        <NavBar/>

        {props.children}

    </Container>
  );
};
