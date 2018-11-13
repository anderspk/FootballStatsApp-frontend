
import React, { Component } from 'react';
import Admin from './containers/admin/Admin';

class Home extends Component {
  
  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        {
          isAuthenticated() &&
            <Admin logout={this.logout} />
        }
        {
          !isAuthenticated() && (
            <div className="container column">
              <h5>Welcome to the Admin Page</h5>
              <h5>
                You are not logged in! Please{' '}
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={this.login}
                >
                  Log In
                </a>
                {' '}to continue.
              </h5>
              <h6>The <b><code>Admin</code></b> component will only be visible once you authenticate.</h6>
            </div>
          )
        }
      </div>
      );
    }
  }

  export default Home;