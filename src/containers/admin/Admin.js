import React, { Component } from 'react';
import Address from './admin-components/Address';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'dashBoard'
    }
  }

  renderPage() {
    switch (this.state.currentPage) {
      case 'dashBoard':
        return <h1>Dashboard</h1>
        break;
      case 'address':
        return <Address />;
      default:
        break;
    }
  }

  render() {
    return (
      <section className='admin-page'>
        <ul className='admin-menu'>
          <li><button onClick={e => this.setState({currentPage: 'dashBoard'})}>Dashboard</button></li>
          <li><button onClick={e => this.setState({currentPage: 'address'})}>Address</button></li>
          <li><button>Menu</button></li>
          <li><button>Menu</button></li>
          <li><button>Menu</button></li>
        </ul>
        <div className='admin-main-container'>
          {this.renderPage()}
        </div>
      </section>
    )
  }
}

export default Admin