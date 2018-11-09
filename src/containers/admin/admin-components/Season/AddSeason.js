import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {start_date: null, end_date: null, name: null, description: null} ,
      validation: {start_date: true, end_date: true, name: true, description: true} 
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
           NotificationManager.success('A new season was added!', 'Added Season');
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

  validateForm(){
    let isValidated = true;
    const validation = this.state.validation;
    const dataToSend = this.state.dataToSend;

    // Match id
    if(dataToSend.start_date != null){
      validation.start_date = true;
    }else{
      validation.start_date = false;
      isValidated = false;
    }

    // score
    if(dataToSend.end_date != null){
      validation.end_date = true;
    }else{
      validation.end_date = false;
      isValidated = false;
    }

    // result
    if(dataToSend.name != null){
      validation.name = true;
    }else{
      validation.name = false;
      isValidated = false;
    }

    // result
    if(dataToSend.description != null){
      validation.description = true;
    }else{
      validation.description = false;
      isValidated = false;
    }

    this.setState({ validation: validation })
    return isValidated;
  }


  handleSubmit(e) {
    e.preventDefault();
    if(!this.validateForm()){
      return console.log('error');
    }else{
    console.log('object to send = ', this.state.dataToSend)
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
        <label className="col-2 col-form-label">Start Date</label>
          {!this.state.validation.start_date && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="start_date" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, start_date: e.target.value}})}} />
        
        <label className="col-2 col-form-label">End Date</label>
          {!this.state.validation.end_date && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="end_date" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, end_date: e.target.value}})}} />
        
        <label className="col-2 col-form-label">Season Name</label>
          {!this.state.validation.name && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="name" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, name: e.target.value}})}} />
        
        <label className="col-2 col-form-label">Description</label>
          {!this.state.validation.description && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="description" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, description: e.target.value}})}} />
        

          <button type="submit" className="btn btn-warning btn-lg">Add</button>
        </form>
      </section>;
  }
}

export default AddAddress;
