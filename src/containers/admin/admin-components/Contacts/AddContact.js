import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {person_id: null, contact_type: null, contact_detail: null} ,
      validation: {person_id: true, contact_type: true, contact_detail: true},
      personInput: "",
      renderPersons: false
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
           NotificationManager.success('A new contact was created!', 'New Contact');
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
      .get("https://case-person.herokuapp.com/showPersons")
      .then(response => this.setState({ persons: response.data }));
  }
 
  validateForm(){
    let isValidated = true;
    const validation = this.state.validation;
    const dataToSend = this.state.dataToSend;

    let person = this.state.persons.find(person => person.last_name === this.state.personInput);

    // person id
    if(person){
      validation.person_id = true;
      dataToSend.person_id = person.person_id
    }else{
      validation.person_id = false;
      isValidated = false;
    }

    // contact type
    if(dataToSend.contact_type != null){
      validation.contact_type = true;
    }else{
      validation.contact_type = false;
      isValidated = false;
    }   

    // contact detail
    if(dataToSend.contact_detail != null){
      validation.contact_detail = true;
    }else{
      validation.contact_detail = false;
      isValidated = false;
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

  // HANDLE PERSON DROPDOWN

  handlePersonDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.persons.filter(person => {
      return person.last_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderPersonDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.person_id}
          onMouseDown={e => {
            this.setState({
              person_id: listItem.person_id,
              personInput: listItem.last_name,
              filteredList: []
            });
          }}
        >
          {listItem.last_name}
        </div>
      );
    });
  };

  render() {
    return <section className="container">
        {this.state.autoCompleteList}
        <h1>Add {this.props.addName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>

        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
          <label className="col-2 col-form-label">Person</label>
          <div className="autocomplete">
          {!this.state.validation.person_id && <span className="help-block">Please fill out this field!</span>}
          <input autoComplete="new-password" className="form-control" type="text" name='person_id' value={this.state.personInput} onFocus={e => this.setState({ renderPersons: true })} onBlur={e => {
                this.setState({ filteredList: [], renderPersons: false });
              }} onChange={e => {
                this.setState({ personInput: e.target.value });
                this.handlePersonDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderPersons && this.renderPersonDropdown()}
            </div>
          </div>
          
          <label className="col-2 col-form-label">Contact Type</label>
          {!this.state.validation.contact_type && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='contact_type' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, contact_type: e.target.value}})}} />
          
          <label className="col-2 col-form-label">Contact Detail</label>
          {!this.state.validation.contact_detail && <span className="help-block">Please fill out this field!</span>}
          <input className="form-control" type="text" name='contact_detail' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, contact_detail: e.target.value}})}} />
          <button type="submit" className="btn btn-warning btn-lg">Add</button>


        </form>
      </section>;
  }
}

export default AddContact;
