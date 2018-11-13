import React, { Component } from "react";
import axios from "axios";
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class AddMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {coach_id: null, owner_id: null, location_id: null, association_name: null, association_description: null} ,
      validation: {coach_id: true, owner_id: true, location_id: true, association_name: true, association_description: true},
      team_image: this.props.itemToEdit.team_image,
      coachIdInput: "",
      ownerIdInput: "",
      addressInput: "",
      renderCoaches: false,
      renderOwners: false,
      renderAddresses: false
    };
  }


  createNotification = (type) => {
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('The team was edited!', 'Team Edited');
           break;
         case 'success':
           NotificationManager.success('A new team was added!', 'Team Added');
           break;
         case 'warning':
           NotificationManager.warning('The team was deleted!', 'Team Deleted', 3000);
           break;
         case 'error':
           NotificationManager.error('Error message', 'Click me!', 5000, () => {
             alert('callback');
           });
           break;
       }
     };
  };

componentWillMount() {
    // coach_id
    axios
      .get("https://case-person.herokuapp.com/showCoaches")
      .then(response => {
          const coachIdInput = response.data.find(coaches => coaches.coach_id === this.props.itemToEdit.coach_id).last_name;
          this.setState({ coaches: response.data, coachIdInput: coachIdInput });
        });
    // owner_id
    axios
      .get("http://case-person.herokuapp.com/showOwners")
      .then(response => {
          const ownerIdInput = response.data.find(owners => owners.owner_id === this.props.itemToEdit.owner_id).last_name;
          this.setState({ owners: response.data, ownerIdInput: ownerIdInput });
        });
    // location_id
    axios
      .get("http://case-address.herokuapp.com/showAddresses")
      .then(response => {
          const addressInput = response.data.find(addresses => addresses.location_id === this.props.itemToEdit.location_id).location_name;
          this.setState({ addresses: response.data, addressInput: addressInput });
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

    let coach = this.state.coaches.find(coach => coach.last_name === this.state.coachIdInput);
    let owner = this.state.owners.find(owner => owner.last_name === this.state.ownerIdInput);
    let address = this.state.addresses.find(address => address.location_name === this.state.addressInput);

    // coach id
    if(coach){
      validation.coach_id = true;
      dataToSend.coach_id = coach.coach_id;
    } else { 
      validation.coach_id = false;
      isValidated = false;
    }

    // owner id
    if(owner){
      validation.owner_id = true;
      dataToSend.owner_id = owner.owner_id;
    } else { 
      validation.owner_id = false;
      isValidated = false;
    }

    // location id
    if(address){
      validation.location_id = true;
      dataToSend.location_id = address.location_id;
    } else {
      validation.location_id = false;
      isValidated = false;
    }

    // association name
    if(dataToSend.association_name != null){
      validation.association_name = true;
    }else{
      validation.association_name = false;
      isValidated = false;
    }

    // association description
    if(dataToSend.association_description != null){
      validation.association_description = true;
    }else{
      validation.association_description = false;
      isValidated = false;
    }

    this.setState({ validation: validation })
    return isValidated;
  }

  sendImage(){
    let image_object = {team_image: this.state.dataToSend.team_image, team_id: this.state.dataToSend.team_id};
    return image_object;
  }

  sendTeam(){
    let team_object = {team_id: this.state.dataToSend.team_id, coach_id: this.state.dataToSend.coach_id, owner_id: this.state.dataToSend.owner_id, location_id: this.state.dataToSend.location_id, association_name: this.state.dataToSend.association_name, association_description: this.state.dataToSend.association_description};
    return team_object;
  }

  handleSubmit(e) {
    e.preventDefault();
    if(!this.validateForm()){
      return console.log('error');
    }else{
      console.log(this.sendTeam(), " = team")
    /*
    axios
      .put("https://case-users.herokuapp.com/updateTeamImage", this.sendImage())
      .catch(error => console.log(error));
    /*
    axios
      .put(this.props.associationApiURL, this.sendTeam())
      .catch(error => console.log(error));
    */
    axios
      .put(this.props.teamApiURL, this.sendTeam())
      .catch(error => console.log(error))
      .then(response => this.props.onRouteChange())
      .then(this.createNotification('info'));
    }  
  }

  // HANDLE COACH DROPDOWN

  handleCoachDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.coaches.filter(coach => {
      return coach.last_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderCoachDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.coach_id}
          onMouseDown={e => {
            this.setState({
              coach_id: listItem.coach_id,
              coachIdInput: listItem.last_name,
              filteredList: []
            });
          }}
        >
          {listItem.last_name}
        </div>
      );
    });
  };

   // HANDLE OWNER DROPDOWN

  handleOwnerDropdown = e => {
    let input = e.target.value.toLowerCase();
    console.log(input, 'input');
    let filteredList = this.state.owners.filter(owner => {
      return owner.last_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderOwnerDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.owner_id}
          onMouseDown={e => {
            this.setState({
              owner_id: listItem.owner_id,
              ownerIdInput: listItem.last_name,
              filteredList: []
            });
          }}
        >
          {listItem.last_name}
        </div>
      );
    });
  };


  // HANDLE ADDRESS DROPDOWN

  handleAddressDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.addresses.filter(address => {
      return address.location_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderAddressDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.location_id}
          onMouseDown={e => {
            this.setState({
              location_id: listItem.location_id,
              addressInput: listItem.location_name,
              filteredList: []
            });
          }}
        >
          {listItem.location_name}
        </div>
      );
    });
  };

 
  render() {
    const { deleteURL, itemToEdit } = this.props;
    console.log(itemToEdit.team_image, "image")
    return <section className="container">
        {this.state.autoCompleteList}
        <h1>Edit {this.props.editName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>

        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>

        {/* COACH*/}
          <label className="col-2 col-form-label">Coach Last Name</label>
          <div className="autocomplete">
          {!this.state.validation.coach_id && <span className="help-block">Please correct the error</span>}
            <input className="form-control" type="text" name='coach_id' value={this.state.coachIdInput} onFocus={e => this.setState({ renderCoaches: true })} onBlur={e => {
                this.setState({ filteredList: [], renderCoaches: false });
              }} onChange={e => {
                this.setState({ coachIdInput: e.target.value });
                this.handleCoachDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderCoaches && this.renderCoachDropdown()}
            </div>
          </div>

          {/* OWNER */}
          <label className="col-2 col-form-label">Owner Last Name</label>
          <div className="autocomplete">
          {!this.state.validation.owner_id && <span className="help-block">Please correct the error</span>}
            <input className="form-control" type="text" name='owner_id' value={this.state.ownerIdInput} onFocus={e => this.setState({ renderOwners: true })} onBlur={e => {
                this.setState({ filteredList: [], renderOwners: false });
              }} onChange={e => {
                this.setState({ ownerIdInput: e.target.value });
                this.handleOwnerDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderOwners && this.renderOwnerDropdown()}
            </div>
          </div>

          {/* LOCATION ID */}
          <label className="col-2 col-form-label">Location Name</label>
          <div className="autocomplete">
          {!this.state.validation.location_id && <span className="help-block">Please correct the error</span>}
          <input className="form-control" type="text" name='location_id' value={this.state.addressInput} onFocus={e => this.setState({ renderAddresses: true })} onBlur={e => {
                this.setState({ filteredList: [], renderAddresses: false });
              }} onChange={e => {
                this.setState({ addressInput: e.target.value });
                this.handleAddressDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderAddresses && this.renderAddressDropdown()}
            </div>
          </div>
          {/* ASSOCIATION*/}
          <label className="col-2 col-form-label">Association Name</label>
            <input defaultValue={itemToEdit.association_name} className="form-control" type="text" name="association_name" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, association_name: e.target.value}})}} />
          {/* ASSOCIATION DESCRIPTION*/}
          <label className="col-2 col-form-label">Association Description</label>
            <input defaultValue={itemToEdit.association_description} className="form-control" type="text" name="association_description" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, association_description: e.target.value}})}} />
          {/*IMAGES*/}
          <label className="col-2 col-form-label">Images</label>
          <input defaultValue={itemToEdit.team_image} className="form-control" type="text" name='team_image' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, team_image: e.target.value}})}} />


          <button type="submit" className="btn btn-warning btn-lg">Edit</button>
          {this.props.itemToEdit && <button onClick={e => {axios.delete(deleteURL, itemToEdit).then(response => this.props.onRouteChange()).then(this.createNotification('warning')).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>}
        </form>
      </section>;
  }
}

export default AddMatch;
