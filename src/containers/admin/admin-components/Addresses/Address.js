import React, { Component } from 'react';
import axios from 'axios';
import AddressTable from '../Table';
import EditPage from './EditAddress';
import AddPage from '../AddPage';

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      activePage: 'addressTable',
      itemToEdit: {},
      itemFields: ['address_id', 'address_line_1','address_line_2','address_line_3','postal_code','city','country','location_name','description'],
      itemFieldsName: ['ID', 'Address 1', 'Address 2', 'Address 3', 'Postal Code', 'City', 'Country', 'Location Name', 'Description']
    }
    this.getAddresses();
    this.onEdit = this.onEdit.bind(this);
  }

  getAddresses() {
    axios.get('https://case-address.herokuapp.com/showAddresses')
      .then(response => this.setState({ addresses: response.data }));
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'addressTable'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'addressTable':
        return <AddressTable objectList={this.state.addresses} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Addresses' addButton='Add Address'/>
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateAddress' locationDeleteURL={`https://case-users.herokuapp.com/deleteLocation/${this.state.itemToEdit.location_id}`} addressDeleteURL={`https://case-users.herokuapp.com/deleteAddress/${this.state.itemToEdit.address_id}`}/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL= 'https://case-users.herokuapp.com/createAddress' addName='Address'/>
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

export default Address;