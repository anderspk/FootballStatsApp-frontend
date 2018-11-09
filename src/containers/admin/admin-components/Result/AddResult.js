import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {match_id: null, team_id: null, score: null, result: null} ,
      validation: {match_id: true, team_id: true, score: true, result: true} ,
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
           NotificationManager.success('A new result was added!', 'Added Result');
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
    if(dataToSend.match_id != null){
      validation.match_id = true;
    }else{
      validation.match_id = false;
      isValidated = false;
    }

    // team name
    if(dataToSend.team_id != null){
      validation.team_id = true;
    }else{
      validation.team_id = false;
      isValidated = false;
    }

    // score
    if(dataToSend.score != null){
      validation.score = true;
    }else{
      validation.score = false;
      isValidated = false;
    }

    // result
    if(dataToSend.result != null){
      validation.result = true;
    }else{
      validation.result = false;
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
          <label className="col-2 col-form-label">Match ID</label>
          {!this.state.validation.match_id && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="match_id" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, match_id: e.target.value}})}} />
        
          <label className="col-2 col-form-label">Team Name</label>
          {!this.state.validation.team_id && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="team_id" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, team_id: e.target.value}})}} />
        
        <label className="col-2 col-form-label">Score</label>
          {!this.state.validation.score && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="score" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, score: e.target.value}})}} />
        
        <label className="col-2 col-form-label">Result</label>
          {!this.state.validation.result && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name="result" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, result: e.target.value}})}} />
        

          <button type="submit" className="btn btn-warning btn-lg">Add</button>
        </form>
      </section>;
  }
}

export default AddAddress;
