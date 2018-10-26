import React from 'react';
import axios from 'axios';

const editPage = ({itemToEdit, onRouteChange }) => {

  return(
    <section className='container'>
      <h1>Edit</h1>
      <form>
      {
        Object.keys(itemToEdit).map((item, i) => {
          return (
            <div className='form-group' key={i}>
              <label className='col-2 col-form-label'>{item}</label>
              <input 
                className='form-control' 
                type='text' 
                defaultValue={itemToEdit[item]}
                onChange={e => {itemToEdit[item] = e.target.value; console.log(itemToEdit)}} />
            </div>
          )
        })
      }
      </form>
      <button onClick={e => {axios.put(`https://case-users.herokuapp.com/updateAddress/1`, itemToEdit).then(response => onRouteChange())}} type="button" className="btn btn-warning btn-lg">Save</button>
      <button onClick={console.log(itemToEdit)} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>
    </section>
  )
}

export default editPage;