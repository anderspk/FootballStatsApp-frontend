import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['contact_id', 'person_id', 'contact_type', 'contact_detail'],
      itemFieldsName: ['Contact ID', 'Person ID', 'Contact Type', 'Contact Details']
    }
    this.getData();
    this.onEdit = this.onEdit.bind(this);
  }

  getData() {
    axios.get('https://case-users.herokuapp.com/showContacts')
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
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Contacts' addButton='Add Contact' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateContact' deleteURL={`https://case-users.herokuapp.com/deleteContact/${this.state.itemToEdit.contact_id}`} editName='Contact'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createContact' />
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

export default Contacts;