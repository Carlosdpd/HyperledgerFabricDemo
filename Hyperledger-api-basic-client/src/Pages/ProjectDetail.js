//Home tab page
import React, { Component } from 'react';
import '../Styles/ProjectDetail.css';
import CreateTaskForm from '../Components/CreateTaskForm.js';
import EditProjectForm from '../Components/EditProjectForm.js';
import chainGetInteraction from '../Services/chain_get_interaction.js';
import chainPostInteraction from '../Services/chain_post_interaction.js';
import getFilesInteraction from '../Services/get_files.js';
import deteleFileInteraction from '../Services/delete_file.js';
import downloadFileInteraction from '../Services/download_file.js';
import fileDownload from 'js-file-download';

import { List, Button, Header, Container, Message, Icon, Label } from 'semantic-ui-react';

//Module for the detailed project page
class ProjectDetail extends Component {

  constructor() {
    super();

    this.state = {
      postResponse: '',
      getResponse: '',
      showTaskForm: false,
      showEditForm: false,
      taskList: [],
      pendingTasks: 0,
      projectFiles: []
    };
  }

  //When the component is mounted, get the actual value of the project so the user can visualize it
  componentDidMount() {
    this.chainGetInteractionRequest('getValue', this.props.match.params.data, null);
    this.getFilesRequest(this.props.match.params.data);

  }

  //Push a new route when detail of a task is needed. (This route will contain the name of te project and the index of the task)
  goToTask(index){

    this.props.history.push('/projects/' + this.props.match.params.data  + '/task/' + index);

  }

  getFilesRequest(projectName){

    getFilesInteraction.getFilesService(projectName).then((projectFiles) => {

      try {
        const processedFiles =  projectFiles.data.map((record, i) => {

          return (
            <div key={i}>
              <Label image style={{'margin':'5px'}}>
                {record}
                <Icon name='delete' link style={{'margin':'4px'}} onClick={() => {
                  this.deleteFileRequest(record, i);
                }}/>
                <Icon name='download' link style={{'margin':'4px'}} onClick={() => {
                  this.downloadFileRequest(record, i);
                }}/>

              </Label>
            </div>


          )

        });

        this.setState({
          projectFiles: processedFiles
        });
      } catch (e) {
        console.log(e);
      }

    });

  };

  deleteFileRequest(fileName, index){

    var data = {
      fileName: fileName,
      projectName: this.props.match.params.data
    }

    deteleFileInteraction.deleteFileService(data).then((deleteResponse) => {

      if (deleteResponse.status === 200) {
        this.chainPostInteractionRequest('deleteElemByName', data.projectName, 'documents', data.fileName);
      }

    })
  }

  downloadFileRequest(fileName, index){
    var data = {
      fileName: fileName,
      projectName: this.props.match.params.data
    }

    downloadFileInteraction.downloadFileService(data).then((downloadResponse) => {


      fileDownload(downloadResponse.data, data.fileName);

    })
  }

  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainGetInteractionRequest(functionName, projectName, value) {

    chainGetInteraction.chainGetInteractionService(functionName, projectName, null).then((chainResponse) => {

      //Mapping the results of the query so we can properly show the results
      const processedTasks =  chainResponse.data.tasks.map((record, i) => {

        let recordObj = JSON.parse(record);

        if (recordObj.taskState === 'Pending') {
          this.setState({
            pendingTasks: this.state.pendingTasks + 1
          })
        }

         return (
           <div key={i}>
             <List.Item > <Header as='h3'>Name:</Header> {recordObj.taskName}</List.Item>
             <List.Item > <Header as='h3'>Description:</Header> {recordObj.taskDescription} </List.Item>
             <List.Item > <Header as='h3'>Cost:</Header> {recordObj.taskCost} </List.Item>
             <List.Item > <Header as='h3'>Contractor:</Header> {recordObj.taskContractor} </List.Item>
             <List.Item > <Header as='h3'>State:</Header> <Message>{recordObj.taskState}</Message> </List.Item>

               <Button style={{'marginTop':'10px', 'marginBottom': '10px'}} primary onClick={ () => {
                 this.goToTask(i)
               } } >Go to task</Button>

             <div className='separator'></div>
           </div>

          );
      });

      //Once we recovered and processed all data, set it to the state
      this.setState({
        getResponse: chainResponse.data,
        taskList : processedTasks
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

  chainPostInteractionRequest(fcn, projectName, key, value) {

    //Clean all states when calling a new requet
    this.setState({
      requestStatus: null,
      postResponse: null,
      isLoading: true,
    });

    console.log(fcn + " " + projectName + " " + key + " " + null + " " + value);

    chainPostInteraction.chainPostInteractionService(fcn, projectName, key, null, value).then((chainResponse) => {

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

      this.resetInputs();

    });

  }

  render() {

      const userType = localStorage.getItem('userType');

      return (
          <div>
            <Header as='h1'>Project Name: {this.props.match.params.data} </Header>
            <div className='separator' ></div>

            <Container>
              <Header as='h2'>Project Description:</Header>
              <p>
                {this.state.getResponse.description}
              </p>
              <Header as='h2'>Project Created at:</Header>
              <p>
                {this.state.getResponse.timestamp}
              </p>
              <Header as='h2'>Project Files:</Header>

                {this.state.projectFiles}

              <div className='separator' ></div>

              {userType === 'Admin' ? <div>
                <Button primary onClick={ () => {
                  this.setState({
                    showEditForm: true
                  });
                } } >Edit or delete this project</Button>
                {  this.state.showEditForm ?  <Icon link name='close' onClick={ () => {
                  this.setState({
                    showEditForm: false
                  });
                } }/>  :  null}
              {  this.state.showEditForm ?  <EditProjectForm data={this.props.match.params.data} />  :  null}
              </div> :  null }


              <Header as='h2'>Tasks ({this.state.pendingTasks} Pending Tasks) :</Header>

              { this.state.taskList.length !== 0 ? <div>
                {this.state.taskList}
              </div> :
              <Message
                warning
                header='No tasks available!'
                content='Click the button to add a Task.'
              />

              }


              <Button primary onClick={ () => {
                this.setState({
                  showTaskForm: true
                });
              } } >Create Task</Button>
            {  this.state.showTaskForm ?  <Icon link name='close' onClick={ () => {
              this.setState({
                showTaskForm: false
              });
            } }/>  :  null}


            </Container>

            {  this.state.showTaskForm ?  <CreateTaskForm data={this.props.match.params.data} />  :  null}

          </div>

      );
  }
}

export default ProjectDetail;
