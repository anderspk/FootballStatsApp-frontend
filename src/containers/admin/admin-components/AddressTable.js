import React, { Component } from 'react';



class addressTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchField: '',
    }
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.addresses != this.props.addresses) {
      this.setState({ addresses: newProps.addresses });
    }
  }

  onSearchChange(e) {
    this.setState({
      searchField: e.target.value
    })
  }

  renderTable(filteredAddresses) {
    return filteredAddresses.map(address => {
      return(
        <tr key={address.address_id}>
          <td>{address.address_id}</td>
          <td>{address.address_line_1}</td>
          <td>{address.address_line_2}</td>
          <td>{address.address_line_3}</td>
          <td>{address.postal_code}</td>
          <td>{address.city}</td>
          <td>{address.country}</td>
          <td>{address.location_id}</td>
          <td>{address.location_name}</td>
          <td>{address.description}</td>
          <td>
            <button className="btn btn-info" onClick={e => {this.props.onEdit(address)}} >Edit</button>
          </td>
        </tr>
      )
    })
  }

  render() {
    const { searchField } = this.state;
    const filteredAddresses = this.props.addresses.filter((address) => {
      let searchValue = searchField.toLowerCase();
      return address.address_line_1.toLowerCase().includes(searchValue) ||
        (address.address_line_2 ? address.address_line_2.toLowerCase() : '').includes(searchValue) ||
        (address.address_line_3 ? address.address_line_3.toLowerCase() : '').includes(searchValue) ||
        address.postal_code.includes(searchValue) ||
        address.city.toLowerCase().includes(searchValue) ||
        address.country.toLowerCase().includes(searchValue) ||
        address.location_name.toLowerCase().includes(searchValue) ||
        address.description.toLowerCase().includes(searchValue)
        ;
    });
    return (
      <section className='address-page'>
        <div className="container">
          <h2>Addresses</h2>
          <button type="button" className="btn btn-success">Add Address</button>
          <input className='search' type='text' placeholder='Search address' onChange={this.onSearchChange} />
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Address 1</th>
                <th>Address 2</th>
                <th>Address 3</th>
                <th>Postal Code</th>
                <th>City</th>
                <th>Country</th>
                <th>Location ID</th>
                <th>Location Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{!filteredAddresses ? <p>Loading...</p> : this.renderTable(filteredAddresses)}</tbody>
          </table>
        </div>
      </section>
    )
  }
  
}

export default addressTable;