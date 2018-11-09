import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {address_line_1: null, address_line_2: null, address_line_3: null, postal_code: null, city: null, country: null, location_name: null, description: null} ,
      validation: {address_line_1: true, address_line_2: true, address_line_3: true, postal_code: true, city: true, country: true, location_name: true, description: true} ,
    };
  }

  createNotification = (type) => {
    console.log(type);
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('Info message');
           break;
         case 'success':
           NotificationManager.success('A new address was created!', 'New Address');
           break;
         case 'warning':
           NotificationManager.warning('Warning message', 'Correct the inputs', 3000);
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
    axios
      .get("https://case-address.herokuapp.com/showAddresses")
      .then(response => this.setState({ addresses: response.data }));
  }
 
  validateForm(){
    let isValidated = true;
    const validation = this.state.validation;
    const dataToSend = this.state.dataToSend;


    if(dataToSend.address_line_1 == null){
      validation.address_line_1 = false;
    }else{
      validation.address_line_1 = true;
    }


    if(dataToSend.postal_code == null){
      validation.postal_code = false;
    }else{
      validation.postal_code = true;
    }   


    if(dataToSend.city == null){
      validation.city = false;
    }else{
      validation.city = true;
    }   


    if(dataToSend.country == null){
      validation.country = false;
    }else{
      validation.country = true;
    }   


    if(dataToSend.location_name == null){
      validation.location_name = false;
    }else{
      validation.location_name = true;
    } 

    if(dataToSend.address_line_1 == null || 
       dataToSend.postal_code == null || 
       dataToSend.country == null ||
       dataToSend.city == null ||
       dataToSend.location_name == null){
          isValidated = false;
    }else{
          isValidated = true;
    }   

    this.setState({ validation: validation })
    return isValidated;
  }


  handleSubmit(e) {
    e.preventDefault();
    console.log('object 1 = ', this.state.dataToSend)
    if(!this.validateForm()){
      return console.log('error');
    }else{
    axios
      .post(this.props.apiURL, this.state.dataToSend)
      .then(response => this.props.onRouteChange())
      .then(this.createNotification('success'))
      .catch(error => console.log(error));
    }  
  }

  render() {
    return <section className="container">
        {this.state.autoCompleteList}
        <NotificationContainer/>
        <h1>Add {this.props.addName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>

        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
          <label className="col-2 col-form-label">Address 1</label>
          {!this.state.validation.address_line_1 && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="address_line_1" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, address_line_1: e.target.value}})}} />
          <label className="col-2 col-form-label">Address 2</label>
          <input className="form-control" type="text" name='address_line_2' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, address_line_2: e.target.value}})}} />
          <label className="col-2 col-form-label">Address 3</label>
          <input className="form-control" type="text" name='address_line_3' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, address_line_3: e.target.value}})}} />
          <label className="col-2 col-form-label">Postal Code</label>
          {!this.state.validation.postal_code && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='postal_code' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, postal_code: e.target.value}})}} />
          <label className="col-2 col-form-label">Country</label>
          {!this.state.validation.country && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='country' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, country: e.target.value}})}} />
          <label className="col-2 col-form-label">City</label>
          {!this.state.validation.city && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='city' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, city: e.target.value}})}} />
          <label className="col-2 col-form-label">Location</label>
          {!this.state.validation.location_name && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='location_name' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, location_name: e.target.value}})}} />
          <label className="col-2 col-form-label">Description</label>
          {!this.state.validation.description && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='description' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, description: e.target.value}})}} />
          <button type="submit" className="btn btn-warning btn-lg">Add</button>
        </form>
      </section>;
  }
}

export default AddAddress;
