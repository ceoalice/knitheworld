import React from 'react';
import ReactDOM from 'react-dom';

import NotFoundComponent from "../components/404/404.js";

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

class NotFound extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title : "",
      message : ""
    }
  }

  componentDidMount() {    
    let message, title;

    const query = new URLSearchParams(window.location.search);
    const { match: { url } } = this.props;
    
    if (query.has('project')) {
      title = "Project Not Found";
      message = `Unable To Find a KnitheWorld Project with ID: '${query.get('id')}'.`;
    } else if (query.has('user')) {
      title = "User Not Found";
      message = `Unable To Find a KnitheWorld User with ID: '${query.get('id')}'.`;
    } else {
      title = "Page Not Found";
      message = `Unable To Find a KnitheWorld Web Page with URL Path: '${url}'.`;
    }
  
    this.setState({title, message});
  }

  render () {
    return (
      <NotFoundComponent 
        title={this.state.title} 
        message={this.state.message} 
      />
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="*" component={NotFound} />
    </Router>
  </React.StrictMode>,
document.getElementById('root'));