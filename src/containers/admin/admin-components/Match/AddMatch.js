import React, { Component } from 'react';
import axios from 'axios';

class AddMatch extends Component {

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
     console.log(this.state);
     axios.post((this.props.apiURL) , this.state).then(response => this.props.onRouteChange()).catch(error => console.log(error));
  }

  render() {
    return (
      <section className='container'>
        <h1>Add</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>
        <form onSubmit={e => this.handleSubmit(e)}>
        {
          this.props.formFields.map((formField, i) => {
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

export default AddMatch;