import React, { Component } from 'react';
import axios from 'axios';
import Table from './Table';

class User extends Component {


// CAN MAYBE REMOVE THIS CLASS

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['user_id', 'email'],
      itemFieldsName: ['User ID', 'Email']
    }
    this.getData();
  }

  getData() {
    axios.get('https://case-users.herokuapp.com/showUsers')
      .then(response => this.setState({ data: response.data }));
  }

  onRouteChange = () => {
    this.setState({activePage: 'table'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'table':
        return <Table objectList={this.state.data} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='User' />
      default:
        break;
    }
  }

  render() {
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default User;