import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

class User extends Component {


// CAN MAYBE REMOVE THIS CLASS

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['userId', 'email'],
      itemFieldsName: ['User ID', 'Email']
    }
    this.getData();
    this.onEdit = this.onEdit.bind(this);
  }

  getData() {
    axios.get('https://case-season.herokuapp.com/showSeasons')
      .then(response => this.setState({ data: response.data }));
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'table'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'table':
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='User' addButton='Add User' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateSeason' deleteURL={`https://case-users.herokuapp.com/deleteSeason/${this.state.itemToEdit.user_id}`} editName='User'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createSeason' addName='User' />
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