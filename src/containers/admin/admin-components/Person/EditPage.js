import React from 'react';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';

const editPage = ({itemToEdit, createNotification, onRouteChange, apiURL, deleteURL, editName}) => {


  createNotification = (type) => {
     console.log(type, 'type');
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('The person was edited!', 'Person Edited');
           break;
         case 'success':
           NotificationManager.success('A new address was created!', 'New Address');
           break;
         case 'warning':
           NotificationManager.warning('The person was deleted!', 'Person Deleted', 3000);
           break;
         case 'error':
           NotificationManager.error('Error message', 'You must delete the person associated with this address before you delete the address', 5000, () => {
             alert('callback');
           });
           break;
          default:
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
      <button onClick={e => {axios.put(apiURL, itemToEdit).then(response => onRouteChange()).then(createNotification('info')).catch(error => console.log(error))}} type="button" className="btn btn-warning btn-lg">Save</button>
      <button onClick={e => {axios.delete(deleteURL, itemToEdit).then(response => onRouteChange()).then(createNotification('warning')).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>
    </section>
  )
}

export default editPage;