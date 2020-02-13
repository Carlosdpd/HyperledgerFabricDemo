//Interact tab page
import React, { Component } from 'react';
import '../Styles/CreateTaskForm.css';
import { Header } from 'semantic-ui-react'
import chainPostInteraction from '../Services/chain_post_interaction.js';
import { Input, List, Button, Message } from 'semantic-ui-react';
import  Upload  from './Upload.js'




//Module that represents the Create Task Form.
class EditProjectForm extends Component {

  constructor() {
    super();
    //State variable to handle all of the querys responses and results.
    this.state = {

      projectName: '',
      projectDescription: '',
      requestStatus: null,
      postResponse: null,
      getResponse: null,
      isLoading: false,

    };
  }

  //Get the name of the current project from the route
  componentDidMount() {
    this.setState({
      projectName: this.props.data
    });

  }

  resetInputs(){
    this.setState({

      projectDescription: '',
      isLoading: false,

    });
  }

  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainInteractionRequest(fcn, projectName, key, value) {

    //Clean all states when calling a new requet
    this.setState({
      requestStatus: null,
      postResponse: null,
      getResponse: null,
      isLoading: true,
    });

    chainPostInteraction.chainPostInteractionService(fcn, projectName, key, null, value).then((chainResponse) => {

      this.setState({
        requestStatus : chainResponse.status,
        postResponse : chainResponse.data,
        isLoading: false,

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
              <div className='separatorThick' ></div>
              <List style={{ "textAlign": "left"}}>
                  <Header as='h1'>Edit current project {this.state.projectName}</Header>
                  <Header as='h2'>Fill the inputs to edit the Project </Header>
                  <div className='separator'></div>
                  <List.Header>Project Description</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task name'
                      className='input'
                      value={this.state.projectDescription}
                      onChange={event => this.setState({ projectDescription: event.target.value })}/>
                  </List.Item>

                  <div className='separator'></div>

                  <Upload projectName={this.props.data}/>

                  <div className='separator'></div>


                  <Button loading={this.state.isLoading} primary onClick={ () => {
                    this.chainInteractionRequest('editProject', this.state.projectName, 'description', this.state.projectDescription)
                  } } >Edit Description</Button>

                  <Button loading={this.state.isLoading} color='red' onClick={ () => {
                    this.chainInteractionRequest('deleteValue', this.state.projectName, '', '')
                  } } >DELETE PROJECT</Button>


              </List>
              {this.state.requestStatus && this.state.postResponse
                ?  <div>
                        <Message
                          success
                          header='Transaction submitted successfully!'
                          content={message}
                        / >

                   </div>
                 :
                  null
              }
            </div>
      );
  }
}

export default EditProjectForm;
