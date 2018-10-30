import React, { Component } from 'react';

class AddPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit(e) {
     e.preventDefault();
     console.log(this.state);
  }

  render() {
    return (
      <section className='container'>
        <h1>Edit</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>
        <form onSubmit={e => this.handleSubmit(e)}>
        {
          this.props.formFields.map((formField, i) => {
            if (formField.includes('id')) return;
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