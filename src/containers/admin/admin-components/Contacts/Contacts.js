import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditContact';
import AddPage from './AddContact';

class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['contact_id', 'person_id', 'contact_type', 'contact_detail'],
      itemFieldsName: ['Contact ID', 'Person', 'Contact Type', 'Contact Details'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }


  componentDidMount() {

    const contacts = axios.get('https://case-users.herokuapp.com/showContacts');
    const persons = axios.get("http://case-person.herokuapp.com/showPersons");

    Promise.all([contacts, persons]).then(values => {
      const renderTable = [];
      values[0].data.forEach((contact) => {
        const person = values[1].data.find(person => person.person_id === contact.person_id);
        renderTable.push({
          contact_id: contact.contact_id,
          person_id: person.last_name,
          contact_type: contact.contact_type,
          contact_detail: contact.contact_detail
        });
      });
      this.setState({ renderTable: renderTable, values:values });
    });
  }

  onEdit(editItem) {

    editItem.contact_id = this.state.values[0].data.find(row => row.player_id === editItem.player_id).contact_id;
    editItem.person_id = this.state.values[1].data.find(row => row.last_name === editItem.person_id).person_id;
    
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Contacts' addButton='Add Contact' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateContact' deleteURL={`https://case-users.herokuapp.com/deleteContact/${this.state.itemToEdit.contact_id}`} editName='Contact'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createContact' addName='Contact'/>
      default:
        break;
    }
  }

  
  render() {
    if (!this.state.renderTable) return 'Loading...';
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}


export default Contacts;