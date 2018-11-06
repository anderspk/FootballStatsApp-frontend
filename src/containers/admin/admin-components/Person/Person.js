import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from '../EditPage';
import AddPage from './AddPage';

class Person extends Component {

  constructor(props) {
    super(props);
    this.state = {
      people: [],
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['person_id', 'first_name', 'last_name', 'date_of_birth', 'address_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address ID'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id']
    }
    this.getAddresses();
    this.onEdit = this.onEdit.bind(this);
  }

  getAddresses() {
    axios.get('https://case-person.herokuapp.com/showPersons')
      .then(response => this.setState({ people: response.data }));
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'personTable'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'personTable':
        return <PeopleTable objectList={this.state.people} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Person' addButton='Add Person' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updatePerson' deleteURL={`https://case-users.herokuapp.com/deletePerson/${this.state.itemToEdit.person_id}`} editName='Person'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createPerson' addName='Person' />
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

export default Person;