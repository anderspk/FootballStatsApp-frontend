import React, { Component } from "react";
import axios from "axios";

class AddPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      addressInput: ''
    };
  }

  componentWillMount() {
    axios.get("https://case-address.herokuapp.com/showAddresses")
      .then(addresses => this.setState({ addresses: addresses.data }));
  }

  componentDidMount() {
    let newState = {};
    for (const fieldName of this.props.formFields) {
      // console.log(this.props.formFields, "formfield");
      if (fieldName.includes("id")) continue;
      // console.log(fieldName, "fieldName");
      this.setState({ [fieldName]: null });
      newState[fieldName] = null;
    }
    // console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    axios
      .post(this.props.apiURL, this.state)
      .then(response => this.props.onRouteChange())
      .catch(error => console.log(error));
  }

  handleDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.addresses.filter(address => {
      return address.address_line_1.toLowerCase().includes(input);
    });
    console.log(filteredList, 'filtered')
    this.setState({ filteredList: filteredList });
  };

  renderDropdown() {
    return this.state.filteredList.map(listItem => {
      return <div onClick={e => {
        this.setState({ address_id: listItem.address_id, addressInput:listItem.address_line_1, filteredList: [] });
      }}>{listItem.address_line_1}</div>;
    });
  }

  render() {
    console.log(this.state.filteredList, 'filtered list');
    return (
      <section className="container">
        {this.state.autoCompleteList}
        <h1>Add {this.props.addName}</h1>
        <button
          className="btn btn-info"
          onClick={e => this.props.onRouteChange()}
        >
          Back
        </button>
        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
          <label className="col-2 col-form-label">First Name</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Last Name</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Date of Birth</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Address ID</label>
          <div className="autocomplete">
            <input
              autocomplete="new-password"
              className="form-control"
              type="text"
              value={this.state.addressInput}
              onBlur={e => {this.setState({filteredList: []})}}
              onChange={e => {
                this.setState({ addressInput: e.target.value })
                this.handleDropdown(e);
              }}
            />
            <div className="autocomplete-items">{this.renderDropdown()}</div>
          </div>
          <label className="col-2 col-form-label">Normal Position</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Number</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Team</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <button type="submit" className="btn btn-warning btn-lg">
            Add
          </button>
        </form>
      </section>
    );
  }
}

export default AddPlayer;
