import React from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const editPage = ({itemToEdit, createNotification, onRouteChange, apiURL, locationDeleteURL, addressDeleteURL, editName}) => {

  createNotification = (type) => {
     console.log(type, 'type');
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('Info message');
           break;
         case 'success':
           NotificationManager.success('A new team was created!', 'New Team');
           break;
         case 'warning':
           NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
           break;
         case 'error':
           NotificationManager.error('Error message', 'You must delete the person associated with this address before you delete the address', 5000, () => {
             alert('callback');
           });
           break;
       }
     };
  };


  return(
    <section className='container'>
      <h1>Edit {editName}</h1>
      <button className="btn btn-info" onClick={e => onRouteChange()}>Back</button>
      <form>
      {
        Object.keys(itemToEdit).map((itemProperty, i) => {
          if(i === 0 || i === 5) return;
          return (
            <div className='form-group' key={i}>
              <label className='col-2 col-form-label'>{itemProperty}</label>
              <input 
                className='form-control' 
                type='text' 
                defaultValue={itemToEdit[itemProperty]}
                onChange={e => {itemToEdit[itemProperty] = e.target.value}} />
            </div>
          )
        })
      }
      </form>
      <button onClick={e => {axios.put(apiURL, itemToEdit).then(response => onRouteChange()).catch(error => console.log(error))}} type="button" className="btn btn-warning btn-lg">Save</button>
      <button onClick={e => {this.createNotification('error').then(axios.delete(locationDeleteURL, itemToEdit)).then(axios.delete(addressDeleteURL, itemToEdit)).then(response => onRouteChange()).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>
    </section>
  )
}

export default editPage;