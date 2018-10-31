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
    if (newProps.addresses !== this.props.addresses) {
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
          {this.props.itemFields.map(fieldName => {
              return (
                  <td>{address[fieldName]} </td>
                )
            })}
            <td><button className="btn btn-info" onClick={e => {this.props.onEdit(address)}} >Edit</button></td>
        </tr>
      )
    })
  }

  render() {
    const { searchField } = this.state;
    const filteredAddresses = this.props.addresses.filter((address) => {

      let searchValue = searchField.toLowerCase();
      return this.props.itemFields.find(fieldName => {
        if (address[fieldName]) {
          if (address[fieldName].toLowerCase().includes(searchValue)) {return true}}
      })
    });
    return (
      <section className='address-page'>
        <div className="container-fluid">
          <h2>Addresses</h2>
          <button type="button" className="btn btn-success" onClick={e => this.props.addPage()}>Add Address</button>
          <input className='search' type='text' placeholder='Search address' onChange={this.onSearchChange} />
          <table className="table table-striped">
            <thead>
              <tr>
                {
                  this.props.itemFieldsName.map(fieldName => {
                    return <th>{fieldName}</th>
                  })
                }
                <th></th>
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