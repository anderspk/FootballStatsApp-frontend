import React, { Component } from "react";
import axios from "axios";

class AddPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      addressInput: "",
      renderAddresses: false,
      renderTeams: false
    };
  }

  componentWillMount() {
    axios
      .get("https://case-address.herokuapp.com/showAddresses")
      .then(response => this.setState({ addresses: response.data }));
    axios
      .get("http://case-team.herokuapp.com/showAllTeamData")
      .then(response => this.setState({ teams: response.data }));
  }
 
  handleSubmit(e) {
    e.preventDefault();
    axios
      .post(this.props.apiURL, this.state)
      .then(response => this.props.onRouteChange())
      .catch(error => console.log(error));
  }

  // HANDLE ADDRESS DROPDOWN

  handleAddressDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.addresses.filter(address => {
      return address.address_line_1.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderAddressDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.address_id}
          onMouseDown={e => {
            this.setState({
              address_id: listItem.address_id,
              addressInput: listItem.address_line_1,
              filteredList: []
            });
          }}
        >
          {listItem.address_line_1}
        </div>
      );
    });
  };

  // HANDLE TEAM DROPDOWN

  handleTeamDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.teams.filter(team => {
      return team.association_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderTeamDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.team_id}
          onMouseDown={e => {
            this.setState({
              team_id: listItem.team_id,
              teamInput: listItem.association_name,
              filteredList: []
            });
          }}
        >
          {listItem.association_name}
        </div>
      );
    });
  };

  render() {
    return <section className="container">
        {this.state.autoCompleteList}
        <h1>Add {this.props.addName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>
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
          <input autoComplete="new-password" className="form-control" type="text" value={this.state.addressInput} onClick={e => this.setState({ renderAddresses: true })} onBlur={e => {
                this.setState({ filteredList: [], renderAddresses: false });
              }} onChange={e => {
                this.setState({ addressInput: e.target.value });
                this.handleAddressDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderAddresses && this.renderAddressDropdown()}
            </div>
          </div>
          <label className="col-2 col-form-label">Normal Position</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Number</label>
          <input className="form-control" type="text" onChange={e => {}} />
          <label className="col-2 col-form-label">Team</label>
          <div className="autocomplete">
            <input autoComplete="new-password" className="form-control" type="text" value={this.state.teamInput} onClick={e => this.setState({ renderTeams: true })} onBlur={e => {
                this.setState({ filteredList: [], renderTeams: false });
              }} onChange={e => {
                this.setState({ stateInput: e.target.value });
                this.handleTeamDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderTeams && this.renderTeamDropdown()}
            </div>
          </div>
          <button type="submit" className="btn btn-warning btn-lg">
            Add
          </button>
        </form>
      </section>;
  }
}

export default AddPlayer;
