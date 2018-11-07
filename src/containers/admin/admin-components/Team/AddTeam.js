import React, { Component } from 'react';
import axios from 'axios';

class AddPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let newState = {};
    for (const fieldName of this.props.formFields) {
      console.log(this.props.formFields, 'formfield')
      if (fieldName.includes('id'))
        continue;
      console.log(fieldName, 'fieldName');
      this.setState({[fieldName]:null})
      newState[fieldName] = null;
    }
    console.log(this.state);
  }

  handleSubmit(e) {
     e.preventDefault();

     let associationID = null;
     let coach_id = this.state.coach_id;
     let owner_id = this.state.owner_id;
     let location_id = this.state.location_id;

     let teamData = [coach_id, associationID, owner_id, location_id]

     let association_name = this.state.association_name;
     let association_description = this.state.association_description;

     let assocationData = [association_name, association_description]

     console.log(assocationData);
     console.log(teamData);

     //axios.post((this.props.associationApiURL) , this.state).then(axios.post(this.props.teamApiURL) , this.state).then(response => this.props.onRouteChange()).catch(error => console.log(error));
     axios.post(this.props.associationApiURL, assocationData).then(axios.post(this.props.teamApiURL, teamData)).then(response => this.props.onRouteChange()).catch(error => console.log(error));
  }

  render() {
    return (
      <section className='container'>
        <h1>Add</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>
        <form onSubmit={e => this.handleSubmit(e)}>
        {
          this.props.formFields.map((formField, i) => {
            if(i === 0 || i === 1) return;
            return (
              <div className='form-group' key={i}>
                <label className='col-2 col-form-label'>{formField}</label>
                <input 
                  className='form-control' 
                  type='text'
                  onChange={e => {this.setState({[formField]: e.target.value})}} />
              </div>
            )
          })
        }
        <button type="submit" className="btn btn-warning btn-lg">Add</button>
        </form>
      </section>
    )
  }
}

export default AddPage;