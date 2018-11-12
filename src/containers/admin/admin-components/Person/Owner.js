import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from './EditPage';
import AddPage from './AddOwner';

class Owner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['owner_id', 'first_name', 'last_name', 'date_of_birth', 'address_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address Name'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }


  componentDidMount() {

    const owners = axios.get("https://case-person.herokuapp.com/showOwners");
    const addresses = axios.get("https://case-address.herokuapp.com/showAddresses");

    Promise.all([owners, addresses]).then(values => {
      const renderTable = [];
      values[0].data.forEach((owner) => {
        const address = values[1].data.find(address => address.address_id === owner.address_id);
        renderTable.push({
          owner_id: owner.owner_id,
          first_name: owner.first_name,
          last_name: owner.last_name,
          date_of_birth: owner.date_of_birth,
          address_id: address.address_line_1,
        });
      });
      this.setState({ renderTable: renderTable, values:values });
    });
  }

  onEdit(editItem) {
    editItem.person_id = this.state.values[0].data.find(row => row.owner_id === editItem.owner_id).person_id;
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
        return <PeopleTable objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Owner' addButton='Add Owner' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateOwner' deleteURL={`https://case-users.herokuapp.com/deleteOwner/${this.state.itemToEdit.owner_id}`} editName='Owner'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createOwner' addName='Owner'/>
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

export default Owner;