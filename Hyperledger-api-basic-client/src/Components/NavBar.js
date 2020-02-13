//Navigation bar script.
import React, { Component } from 'react';
import { Segment, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import '../Styles/NavBar.css';


export default class NavBar extends Component {

  render() {


    const userType = localStorage.getItem('userType');

    return (
      <Segment style={{'justifyContent':'space-between', 'display':'flex'}} inverted>
        <List relaxed horizontal>
          <List.Item><Link to='/home'>Home</Link></List.Item>
          <List.Item><Link to='/search'>Search</Link></List.Item>
          <List.Item><Link to='/explorer'>Explorer</Link></List.Item>
          {/* <List.Item><Link to='/interact'>Interact</Link></List.Item> */}
          {userType === 'Admin' ? <List.Item><Link to='/create-project'>Create</Link></List.Item> :  null }
          <List.Item><Link to='/projects'>Projects</Link></List.Item>

        </List>

        <p> Logged as {userType}</p>

      </Segment>
    )
  }
}
