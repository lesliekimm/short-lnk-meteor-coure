import 'babel-polyfill';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor'
import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  onSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        if (email) {
          this.setState({error: err.reason});
        }
        else {
          this.setState({error: 'Unable to login. Must provide email and password.'});
        }
      }
      else {
        this.setState({error: ''});
      }
    });
  }

  render() {
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Short Lnk</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
            <input ref="email" type="email" name="email" placeholder="Email" />
            <input ref="password" type="password" name="password" placeholder="Password" />
            <button className="button">Login</button>
          </form>
          <br/>

          Need an account? Click <Link to="/signup">here</Link>.
        </div>
      </div>
    );
  }
};
