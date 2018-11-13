import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from './EditPage';
import AddPage from './AddPerson';

class Person extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['person_id', 'first_name', 'last_name', 'date_of_birth', 'address_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address ID'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }


componentDidMount() {

    const players = axios.get("https://case-person.herokuapp.com/showPersons");
    const addresses = axios.get("http://case-address.herokuapp.com/showAddresses");

    Promise.all([players, addresses]).then(values => {
      const renderTable = [];
      values[0].data.forEach((player) => {
        const address = values[1].data.find(address => address.address_id === player.address_id);
        renderTable.push({
          person_id: player.person_id,
          first_name: player.first_name,
          last_name: player.last_name,
          date_of_birth: player.date_of_birth,
          address_id: address.address_line_1,
        });
      });
      this.setState({ renderTable: renderTable, values:values });
    });
  }


  onEdit(editItem) {
    editItem.person_id = this.state.values[0].data.find(row => row.person_id === editItem.person_id).person_id;
    editItem.address_id = this.state.values[1].data.find(row => row.address_line_1 === editItem.address_id).address_id;
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
        return <PeopleTable objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Person' addButton='Add Person' />
      case 'editPage':
        return <EditPage toEdit='Edit' itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updatePerson' deleteURL={`https://case-users.herokuapp.com/deleteCoach/${this.state.itemToEdit.coach_id}`} editName='Person'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createPerson' addName='Person'/>
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