import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class AddPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {first_name: null, last_name: null, date_of_birth: null, address_id: null, normal_position: null, number: null, team_id: null, player_image: null} ,
      validation: {first_name: true, last_name: true, date_of_birth: true, address_id: true, normal_position: true, number: true, team_id: true},
      addressInput: "",
      teamInput: "",
      addTeamInput: "",
      renderAddresses: false,
      renderTeams: false
    };
  }

  createNotification = (type) => {
    console.log(type);
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('The player was edited!', 'Player Edited');
           break;
         case 'success':
           NotificationManager.success('A new person was created!', 'New Player');
           break;
         case 'warning':
           NotificationManager.warning('The player was deleted!', 'Player Deleted', 3000);
           break;
         case 'error':
           NotificationManager.error('Error message', 'You must delete the person associated with this address before you delete the address', 5000, () => {
             alert('callback');
           });
           break;
       }
     };
  };


  componentWillMount() {
    axios
      .get("https://case-address.herokuapp.com/showAddresses")
      .then(response => {
        const addressInput = response.data.find(addresses => addresses.address_id === this.props.itemToEdit.address_id).address_line_1;
        this.setState({ addresses: response.data, addressInput: addressInput });
      });
    axios
      .get("http://case-team.herokuapp.com/showAllTeamData")
      .then(response => {
        const teamInput = response.data.find(team => team.team_id === this.props.itemToEdit.team_id).association_name;
        this.setState({ teams: response.data, teamInput: teamInput })
      });
  }

  componentDidMount() {
    const { itemToEdit } = this.props;
    this.setState({ dataToSend: itemToEdit });
  }
 
  validateForm(){
    let isValidated = true;
    const validation = this.state.validation;
    const dataToSend = this.state.dataToSend;

    let address = this.state.addresses.find(address => address.address_line_1 === this.state.addressInput);
    let team = this.state.teams.find(team => team.association_name === this.state.teamInput);


    // first_name
    if(dataToSend.first_name != null){
      validation.first_name = true;
    }else{
      validation.first_name = false;
      isValidated = false;
    }

    // last name
    if(dataToSend.last_name != null){
      validation.last_name = true;
    }else{
      validation.last_name = false;
      isValidated = false;
    }

    // date of birth
    if(dataToSend.date_of_birth != null){
      validation.date_of_birth = true;
    }else{
      validation.first_name = false;
      isValidated = false;
    }

    // Address
    if(address){
      validation.address_id = true;
      dataToSend.address_id = address.address_id;
    } else {
      validation.address_id = false;
      isValidated = false;
    }

    // normal_position
    if(dataToSend.normal_position != null){
      validation.normal_position = true;
    }else{
      validation.normal_position = false;
      isValidated = false;
    }

    // number
    if(dataToSend.number != null){
      validation.number = true;
    }else{
      validation.number = false;
      isValidated = false;
    }

    // team id
    if(team){
      validation.team_id = true;
      dataToSend.team_id = team.team_id;
    } else { 
      validation.team_id = false;
      isValidated = false;
    }

    // team id
    if(team){
      validation.team_id = true;
      dataToSend.team_id = team.team_id;
    } else { 
      validation.team_id = false;
      isValidated = false;
    }

    this.setState({ validation: validation })
    return isValidated;
  }

  sendImage(){
    let image_object = {player_image: this.state.dataToSend.player_image, player_id: this.state.dataToSend.player_id};
    return image_object;
  }


  handleSubmit(e) {
    e.preventDefault();
    console.log(this.sendImage(), "object")
    if(!this.validateForm()){
      return console.log('error');
    }else{
      axios
        .put("https://case-users.herokuapp.com/updatePlayerImage", this.sendImage())
        .catch(error => console.log(error));

      axios
        .put(this.props.apiURL, this.state.dataToSend)
        .then(response => this.props.onRouteChange())
        .then(this.createNotification('info'))
        .catch(error => console.log(error));
    }
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
    const { deleteURL, itemToEdit } = this.props;
    return <section className="container">
        {this.state.autoCompleteList}
        <h1>{this.props.toEdit ? 'Edit ' : 'Add'} {this.props.addName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>
        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>

          {/* FIRST NAME */}
          <label className="col-2 col-form-label">First Name</label>
          {!this.state.validation.first_name && <span className="help-block">Please fill out this field</span>}
          <input defaultValue={itemToEdit.first_name} className="form-control" type="text" name="first_name" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, first_name: e.target.value}})}} />

          {/* LAST NAME */}
          <label className="col-2 col-form-label">Last Name</label>
          {!this.state.validation.last_name && <span className="help-block">Please fill out this field</span>}
          <input defaultValue={itemToEdit.last_name} className="form-control" type="text" name='last_name' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, last_name: e.target.value}})}} />
            
          {/* DATE OF BIRTH */}
          <label className="col-2 col-form-label">Date of Birth</label>
          {!this.state.validation.date_of_birth && <span className="help-block">Please fill out this field</span>}
          <input defaultValue={itemToEdit.date_of_birth} className="form-control" type="date" name='date_of_birth' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, date_of_birth: e.target.value}})}} />
          
          {/* ADDRESS ID*/}
          <label className="col-2 col-form-label">Address Name</label>
          <div className="autocomplete">
          {!this.state.validation.address_id && <span className="help-block">Please correct the error</span>}
          <input autocomplete='new-password' className="form-control" type="text" name='address_id' value={this.state.addressInput} onFocus={e => this.setState({ renderAddresses: true })} onBlur={e => {
                this.setState({ filteredList: [], renderAddresses: false });
              }} onChange={e => {
                this.setState({ addressInput: e.target.value });
                this.handleAddressDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderAddresses && this.renderAddressDropdown()}
            </div>
          </div>
          
          {/* NORMAL POSITION */}
          <label className="col-2 col-form-label">Normal Position</label>
          {!this.state.validation.normal_position && <span className="help-block">Please fill out this field</span>}
          <input defaultValue={itemToEdit.normal_position} className="form-control" type="text" name='normal_position' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, normal_position: e.target.value}})}} />
          
          {/* NUMBER*/}
          <label className="col-2 col-form-label">Number</label>
          {!this.state.validation.number && <span className="help-block">Please fill out this field</span>}
          <input defaultValue={itemToEdit.number} className="form-control" type="text" name='number' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, number: e.target.value}})}} />
          
          {/* TEAM NAME */}
          <label className="col-2 col-form-label">Team Name</label>
          <div className="autocomplete">
          {!this.state.validation.team_id && <span className="help-block">Please correct the error</span>}
            <input className="form-control" type="text" name='team_id' value={this.state.teamInput} onFocus={e => this.setState({ renderTeams: true })} onBlur={e => {
                this.setState({ filteredList: [], renderTeams: false });
              }} onChange={e => {
                this.setState({ teamInput: e.target.value });
                this.handleTeamDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderTeams && this.renderTeamDropdown()}
            </div>
          </div>

          {/*IMAGES*/}
          <label className="col-2 col-form-label">Images</label>
          <input defaultValue={itemToEdit.player_image} className="form-control" type="text" name='player_image' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, player_image: e.target.value}})}} />

          <button type="submit" className="btn btn-warning btn-lg">Edit</button>
          {this.props.itemToEdit && <button onClick={e => {axios.delete(deleteURL, itemToEdit).then(response => this.props.onRouteChange()).then(this.createNotification('warning')).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>}

        </form>
      </section>;
  }
}

export default AddPlayer;
