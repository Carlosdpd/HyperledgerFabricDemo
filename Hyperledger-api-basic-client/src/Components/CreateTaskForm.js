//Interact tab page
import React, { Component } from 'react';
import '../Styles/CreateTaskForm.css';
import { Header } from 'semantic-ui-react'
import chainPostInteraction from '../Services/chain_post_interaction.js'
import { Input, List, Button, Message } from 'semantic-ui-react';


//Module that represents the Create Task Form.
class CreateTaskForm extends Component {

  constructor() {
    super();
    //State variable to handle all of the querys responses and results.
    this.state = {

      projectName: '',
      taskName: '',
      taskDescription: '',
      taskCost: 0,
      taskContractor: '',
      taskState: '',
      isLoading: false,
      requestStatus: null,
      postResponse: null,

    };
  }

  //Get the name of the current project from the route
  componentDidMount() {
    this.setState({
      projectName: this.props.data
    })

  }

  resetInputs(){
    this.setState({
      taskName: '',
      taskDescription: '',
      taskCost: 0,
      taskContractor: '',
      taskState: '',
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
                  <Header as='h1'>Create a new Task for {this.state.projectName}</Header>
                  <Header as='h2'>Fill the inputs to create a new Task </Header>
                  <div className='separator'></div>
                  <List.Header>Task name</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task name'
                      className='input'
                      value={this.state.taskName}
                      onChange={event => this.setState({ taskName: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task description</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task description'
                      className='large-input'
                      value={this.state.taskDescription}
                      onChange={event => this.setState({ taskDescription: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task Cost</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task description'
                      className='large-input'
                      value={this.state.taskCost}
                      onChange={event => this.setState({ taskCost: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task Contractor</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task contractor'
                      className='large-input'
                      value={this.state.taskContractor}
                      onChange={event => this.setState({ taskContractor: event.target.value })}/>
                  </List.Item>
                  <Button loading={this.state.isLoading} primary onClick={ () => {
                    let taskInfo = {
                      taskName : this.state.taskName,
                      taskDescription: this.state.taskDescription,
                      taskCost: this.state.taskCost,
                      taskContractor: this.state.taskContractor,
                      taskState: 'Pending'
                    }
                    this.chainInteractionRequest('editProject', this.state.projectName, 'tasks', taskInfo)
                  } } >Create</Button>
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

export default CreateTaskForm;
