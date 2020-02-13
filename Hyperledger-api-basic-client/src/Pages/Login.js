//Home tab page
import React, { Component } from 'react';
import '../Styles/Login.css';
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react';
import login from '../Services/login.js';


class Login extends Component {

  constructor() {
    super();
    this.state = {

      adminUsername:'',
      adminPassword: '',
      contractorUsername:'',
      contractorPassword: ''

    };
  }

  //Login request
  loginRequest(data) {

    login.loginService(data).then((token)  => {

      //Detect the name of the caller
      if (data.orgName === 'Org1' ) {
        localStorage.setItem('userType', 'Admin');
      }else{
        localStorage.setItem('userType', 'Contractor');
      }

      //Saving the token session.
      localStorage.setItem('auth_token', token.data.token);
    });

  }



  render() {
      return (
        <Segment placeholder>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column className='common' >
              <Form>
                <Form.Input icon='user' iconPosition='left' label='Username' placeholder='Username' onChange={event => this.setState({ adminUsername: event.target.value })}/>
                <Form.Input icon='lock' iconPosition='left' label='Password' type='password' onChange={event => this.setState({ adminPassword: event.target.value })}/>
                <Button content='Login as admin' primary onClick={ () => {
                  let loginObj = {
                    username: this.state.adminUsername,
                    orgName: "Org1"
                  };
                  this.loginRequest(loginObj);
                }} />
              </Form>
            </Grid.Column>

            <Grid.Column className='common' >
              <Form>
                <Form.Input icon='user' iconPosition='left' label='Username' placeholder='Username' onChange={event => this.setState({ contractorUsername: event.target.value })}/>
                <Form.Input icon='lock' iconPosition='left' label='Password' type='password' onChange={event => this.setState({ contractorPassword: event.target.value })}/>
                <Button content='Login as contractor' primary onClick={ () => {
                  let loginObj = {
                    username: this.state.contractorUsername,
                    orgName: 'Org2'
                  }
                  this.loginRequest(loginObj);
                }} />
              </Form>
            </Grid.Column>
          </Grid>

          <Divider vertical>Or</Divider>
        </Segment>
      )


  }
}

export default Login;
