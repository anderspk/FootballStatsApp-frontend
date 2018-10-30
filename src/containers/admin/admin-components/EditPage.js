import React from 'react';
import axios from 'axios';

const editPage = ({itemToEdit, onRouteChange, apiURL, editName }) => {

  return(
    <section className='container'>
      <h1>Edit {editName}</h1>
      <button className="btn btn-info" onClick={e => onRouteChange()}>Back</button>
      <form>
      {
        Object.keys(itemToEdit).map((itemProperty, i) => {
          if (itemProperty.includes('id')) return;
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
      <button onClick={e => {axios.put(apiURL + itemToEdit.address_id, itemToEdit).then(response => onRouteChange()).catch(error => console.log(error))}} type="button" className="btn btn-warning btn-lg">Save</button>
      <button onClick={console.log(itemToEdit, 'hei')} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>
    </section>
  )
}

export default editPage;