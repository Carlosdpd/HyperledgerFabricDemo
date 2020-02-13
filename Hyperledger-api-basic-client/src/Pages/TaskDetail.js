//Home tab page
import React, { Component } from 'react';
import '../Styles/ProjectDetail.css';
import EditTaskForm from '../Components/EditTaskForm.js';
import chainGetInteraction from '../Services/chain_get_interaction.js';
import { Button, Header, Container, Icon } from 'semantic-ui-react';

//Module for the detailed project page
class TaskDetail extends Component {

  constructor() {
    super();

    this.state = {
      postResponse: '',
      getResponse: '',
      task: '',
      showTaskEditForm: false
    };
  }

  //When the component is mounted, get the actual value of the task base on the index so the user can visualize it
  componentDidMount() {

    this.chainInteractionRequest('getTaskByIndex', this.props.match.params.data, this.props.match.params.index, null);

  }


  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainInteractionRequest(functionName, projectName, index, value) {

    chainGetInteraction.chainGetInteractionService(functionName, projectName, index, null).then((chainResponse) => {

      let taskObj = JSON.parse(chainResponse.data)

      this.setState({
        task: taskObj
      });

    }).catch(error => {

      //If an error occurs, show it on console.
      console.log("Error:" + error.message);
      this.setState({
        isFetching: false,
        onError: true
      });

    });
  }



  render() {
      return (
          <div>
            <Header as='h1'>Project Name: {this.props.match.params.data} </Header>
            <div className='separator' ></div>

            <Container>
              <Header as='h2'>Task Name:</Header>
              <p>
                {this.state.task.taskName}
              </p>
              <div className='separator' ></div>
              <Header as='h2'>Task Description:</Header>
              <p>
                {this.state.task.taskDescription}
              </p>
              <div className='separator' ></div>
              <Header as='h2'>Task Cost:</Header>
              <p>
                {this.state.task.taskCost}
              </p>
              <div className='separator' ></div>
              <Header as='h2'>Task Contractor:</Header>
              <p>
                {this.state.task.taskContractor}
              </p>
              <div className='separator' ></div>
              <Header as='h2'>Task State:</Header>
              <p>
                {this.state.task.taskState}
              </p>
              <div className='separator' ></div>

              <Button primary onClick={ () => {
                this.setState({
                  showTaskEditForm: true
                });
              } } >Edit this Task</Button>
            {  this.state.showTaskEditForm ?  <Icon link name='close' onClick={ () => {
              this.setState({
                showTaskEditForm: false
              });
            } }/>  :  null}

            {  this.state.showTaskEditForm ?  <EditTaskForm task={this.state.task} index={this.props.match.params.index} projectName={this.props.match.params.data} />  :  null}

            </Container>

          </div>

      );
  }
}

export default TaskDetail;
