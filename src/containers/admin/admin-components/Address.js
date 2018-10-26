import React, { Component } from 'react';
import axios from 'axios';
import AddressTable from './AddressTable';
import EditPage from './EditPage';

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      activePage: 'addressTable',
      itemToEdit: {}
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

  onRouteChange = () => {
    this.setState({activePage: 'addressTable'})
  }

  getView() {
    let item = this.state.itemToEdit;

    switch (this.state.activePage) {
      case 'addressTable':
        return <AddressTable addresses={this.state.addresses} onEdit={this.onEdit} />
      case 'editPage':
        return <EditPage itemToEdit={item} onRouteChange={this.onRouteChange} />
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