//Interact tab page
import React, { Component } from 'react';
import '../Styles/CreateTaskForm.css';
import { Header } from 'semantic-ui-react'
import chainPostInteraction from '../Services/chain_post_interaction.js'
import { Input, List, Button, Message, Select } from 'semantic-ui-react';


//Module that represents the Create Task Form.
class EditTaskForm extends Component {

  constructor() {
    super();
    //State variable to handle all of the querys responses and results.
    this.state = {

      projectName: '',
      taskIndex: '',
      taskName: '',
      taskDescription: '',
      taskCost: '',
      taskContractor: '',
      taskState: '',
      requestStatus: null,
      postResponse: null,
      getResponse: null,
      isLoading: false,

    };
  }

  //Get the name of the current project and task from the route and props.
  componentDidMount() {
    this.setState({
      projectName: this.props.projectName,
      taskIndex: this.props.index,
      taskName: this.props.task.taskName,
      taskDescription: this.props.task.taskDescription,
      taskCost: this.props.task.taskCost,
      taskContractor: this.props.task.taskContractor,
      taskState: this.props.task.taskState
    })

  }

  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainInteractionRequest(fcn, projectName, index, value, key) {

    //Clean all states when calling a new requet
    this.setState({
      requestStatus: null,
      postResponse: null,
      getResponse: null,
      isLoading: true,
    });

    chainPostInteraction.chainPostInteractionService(fcn, projectName, key, index, value).then((chainResponse) => {

      this.setState({
        requestStatus : chainResponse.status,
        postResponse : chainResponse.data,
        isLoading: false,

      });

    }).catch(error => {

      //If an error occurs, show it on console.
      console.log("Error:" + error.message);
      this.setState({
        isLoading: false,

      });

    });

  }

  render() {

      const message = 'The transaction id is:' + this.state.postResponse;
      const userType = localStorage.getItem('userType');
      const countryOptions = [
        { text: 'Approved', value: 'Approved' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Rejected', value: 'Rejected' }
      ]

      return (
            <div>
              <div className='separatorThick' ></div>
              <List style={{ "textAlign": "left"}}>
                  <Header as='h1'>Edit current task {this.state.projectName}</Header>
                  <Header as='h2'>Fill the inputs to edit the task </Header>
                  <div className='separator'></div>
                  <List.Header>Task Name</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task name'
                      className='input'
                      value={this.state.taskName}
                      onChange={event => this.setState({ taskName: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task Description</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task name'
                      className='input'
                      value={this.state.taskDescription}
                      onChange={event => this.setState({ taskDescription: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task Cost</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task cost'
                      className='input'
                      value={this.state.taskCost}
                      onChange={event => this.setState({ taskCost: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task Contractor</List.Header>
                  <List.Item>
                      <Input placeholder='Add the task name'
                      className='input'
                      value={this.state.taskContractor}
                      onChange={event => this.setState({ taskContractor: event.target.value })}/>
                  </List.Item>
                  <List.Header>Task State</List.Header>
                  <List.Item>
                      <Select disabled={userType === 'Contractor'}
                        value={this.state.taskState} options={countryOptions}
                        onChange= {(event, data) => this.setState({ taskState : data.value })} />

                  </List.Item>

                  <Button loading={this.state.isLoading} primary onClick={ () => {

                    let taskInfo = {
                      taskName : this.state.taskName,
                      taskDescription: this.state.taskDescription,
                      taskCost: this.state.taskCost,
                      taskContractor: this.state.taskContractor,
                      taskState: this.state.taskState
                    }


                    if (userType === 'Contractor') {
                      taskInfo.taskState = 'Pending';
                    }

                    this.chainInteractionRequest('editTaskByIndex', this.state.projectName, this.state.taskIndex, taskInfo);
                  } } >Edit Task Description</Button>

                  <Button loading={this.state.isLoading} color='red' onClick={ () => {
                    this.chainInteractionRequest('deleteElemByIndex', this.state.projectName, this.state.taskIndex, '', 'tasks');
                  } } >DELETE TASK</Button>


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

export default EditTaskForm;
