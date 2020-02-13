//Interact tab page
import React, { Component } from 'react';
import '../Styles/CreateForm.css';
import { Header } from 'semantic-ui-react'
import chainPostInteraction from '../Services/chain_post_interaction.js'
import { Input, List, Button, Message } from 'semantic-ui-react';

//Module that represents the Create Project Form.
class CreateForm extends Component {

  constructor() {
    super();
    //State variable to handle all of the inputs of the form.
    this.state = {

      projectName: '',
      projectDescription: '',
      isLoading: false,
      requestStatus: null,
      postResponse : null

    };
  }

  //Function to reset the inputs.
  resetInputs(){
    this.setState({

      projectName: '',
      projectDescription: '',
      isLoading: false

    });
  }

  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainInteractionRequest(fcn, projectName, value) {

    //Clean all states when calling a new requet
    this.setState({
      requestStatus: null,
      postResponse : null,
      isLoading: true
    });

    //Creation of an aditional structure that will help serielize the data for the HLF API
    let description = {
      description : value,
      timestamp: new Date(),
      tasks: [],
      documents: []
    }

    chainPostInteraction.chainPostInteractionService(fcn, projectName, null, null, description).then((chainResponse) => {

      //Once completed, set the results to the state and stop loading
      this.setState({
        requestStatus : chainResponse.status,
        postResponse : chainResponse.data,
        isLoading: false
      });

      this.resetInputs();

    }).catch(error => {

      //If an error occurs, show it on console.
      console.log("Error:" + error.message);
      this.setState({
        isLoading: false,
      });
      this.resetInputs();

    });

  }

  render() {

    const message = 'The transaction id is:' + this.state.postResponse;

      return (
            <div>
              <List style={{ "textAlign": "left"}}>
                  <Header as='h1'>Create a new Project</Header>
                  <Header as='h2'>Fill the inputs to create a new Project </Header>
                  <div className='separator'></div>
                  <List.Header>Project name</List.Header>
                  <List.Item>
                      <Input placeholder='Add the Project name'
                      className='input'
                      value={this.state.projectName}
                      onChange={event => this.setState({ projectName: event.target.value })}/>
                  </List.Item>
                  <List.Header>Project description</List.Header>
                  <List.Item>
                      <Input placeholder='Add the Project description'
                      className='large-input'
                      value={this.state.projectDescription}
                      onChange={event => this.setState({ projectDescription: event.target.value })}/>
                  </List.Item>
                  <Button loading={this.state.isLoading} primary onClick={ () => {
                    this.chainInteractionRequest('insertValue', this.state.projectName, this.state.projectDescription)
                  } } >Create Project</Button>
              </List>
              {this.state.requestStatus && this.state.postResponse
                ?  <div>
                        <Message
                          success
                          header='Transaction submitted successfully!'
                          content={message}
                        >

                      </Message>
                   </div>
                 :
                  null
              }
            </div>
      );
  }
}

export default CreateForm;
