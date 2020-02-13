//Routes handling
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../Pages/Home.js';
import Explorer from '../Pages/Explorer.js';
import Interact from '../Pages/Interact.js';
import Create from '../Pages/Create.js';
import Projects from '../Pages/Projects.js';
import ProjectDetail from '../Pages/ProjectDetail.js';
import TaskDetail from '../Pages/TaskDetail.js';
import Search from '../Pages/Search.js';
import Login from '../Pages/Login.js';



// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/home' component={Home}/>
      <Route path='/search/:data' component={Search}/>
      <Route path='/search' component={Search}/>
      <Route path='/explorer' component={Explorer}/>
      <Route path='/interact' component={Interact}/>
      <Route path='/create-project' component={Create}/>
      <Route path='/projects/:data/task/:index' component={TaskDetail}/>
      <Route path='/projects/:data' component={ProjectDetail}/>
      <Route path='/projects' component={Projects}/>
    </Switch>
  </main>
)

export default Main
