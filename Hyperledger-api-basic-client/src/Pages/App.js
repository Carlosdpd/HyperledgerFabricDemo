//Main app component.
import React, { Component } from 'react';
import '../Styles/App.css';
import Layout from '../Components/Layout.js';
import Main from '../Components/Main.js';

class App extends Component {

  render() {
      return (
          <Layout>
            <Main />
          </Layout>

      );
  }
}

export default App;
