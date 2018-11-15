import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from './EditPage';
import AddPage from './AddCoach';

class Coach extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['coach_id', 'first_name', 'last_name', 'date_of_birth', 'address_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address Name'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

componentDidMount() {

    const players = axios.get("https://case-person.herokuapp.com/showCoaches");
    const addresses = axios.get("http://case-address.herokuapp.com/showAddresses");

    Promise.all([players, addresses]).then(values => {
      const renderTable = [];
      values[0].data.forEach((player) => {
        const address = values[1].data.find(address => address.address_id === player.address_id);
        renderTable.push({
          coach_id: player.coach_id,
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
    editItem.person_id = this.state.values[0].data.find(row => row.coach_id === editItem.coach_id).person_id;
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
        return <PeopleTable objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Coach' addButton='Add Coach' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateCoach' deleteURL={`https://case-users.herokuapp.com/deleteCoach/${this.state.itemToEdit.coach_id}`} editName='Coach'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createCoach' addName='Coach'/>
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

export default Coach;