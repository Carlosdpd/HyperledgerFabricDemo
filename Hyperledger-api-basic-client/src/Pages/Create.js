//Home tab page
import React, { Component } from 'react';
import '../Styles/App.css';
import CreateForm from '../Components/CreateForm.js'

class Create extends Component {

  constructor() {
    super();
    this.state = {

    };
  }

  render() {
      return (
          <div>
            <CreateForm />
          </div>

      );
  }
}

export default Create;
