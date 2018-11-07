import React, { Component } from 'react';
import axios from 'axios';
// import {NotificationContainer, NotificationManager} from 'react-notifications';

class AddPage extends Component {


  constructor(props) {
    super(props);
    this.state = {};
  }

  // createNotification = (type) => {
  //   console.log(type, 'type');
  //   return () => {
  //     switch (type) {
  //       case 'info':
  //         NotificationManager.info('Info message');
  //         break;
  //       case 'success':
  //         NotificationManager.success('A new team was created!', 'New Team');
  //         break;
  //       case 'warning':
  //         NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
  //         break;
  //       case 'error':
  //         NotificationManager.error('Error message', 'Click me!', 5000, () => {
  //           alert('callback');
  //         });
  //         break;
  //     }
  //   };
  // };

  componentDidMount() {
    let newState = {};
    for (const fieldName of this.props.formFields) {
      if (fieldName.includes('id'))
        continue;
      this.setState({[fieldName]:null})
      newState[fieldName] = null;
    }
  }

  handleSubmit(e) {
     e.preventDefault();
     console.log("object = " + this.state)     
     axios.post(this.props.associationApiURL, this.state).then(axios.post(this.props.teamApiURL, this.state)).then(response => this.props.onRouteChange()).catch(error => console.log(error));
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
        <button type="submit" className="btn btn-warning btn-lg" onClick={this.createNotification('success')}>Add</button>
        </form>
      </section>
    )
  }
}

export default AddPage;