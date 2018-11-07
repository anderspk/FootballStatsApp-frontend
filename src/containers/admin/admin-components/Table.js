import React, { Component } from 'react';
import TableRow from './TableRow';

class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchField: '',
    }
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  // componentWillReceiveProps(newProps) {
  //   // if (newProps.objectList !== this.props.objectList) {
  //   //   this.setState({ objectList: newProps.objectList });
  //   // }
  // }

  onSearchChange(e) {
    this.setState({
      searchField: e.target.value
    })
  }

  renderTable(filteredObjectList) {
    console.log('rendering...')
    return filteredObjectList.map(filteredObject => 
      <tr>
        {
          this.props.itemFields.map(fieldName => {
            return <td>{filteredObject[fieldName]}</td>
          })
        }
        <td><button className="btn btn-info" onClick={e => {this.props.onEdit(filteredObject)}} >Edit</button></td>
      </tr>
    )
  }

  render() {
    const { searchField } = this.state;
    const filteredObjectList = this.props.objectList.filter((filteredObject) => {

      let searchValue = searchField.toLowerCase();

      return this.props.itemFields.find(fieldName => {
          if (filteredObject[fieldName]) {
            if (filteredObject[fieldName].toLowerCase().includes(searchValue)) {return true}}
      })

    });
    return (
      <section className='address-page'>
        <div className="container-fluid">
          <h2>{this.props.title}</h2> 
          <button type="button" className="btn btn-success" onClick={e => this.props.addPage()}>{this.props.addButton}</button>
          <input className='search' type='text' placeholder='Search address' onChange={this.onSearchChange} />
          <table className="table table-striped">
            <thead>
              <tr>
                {
                  this.props.itemFieldsName.map(fieldName => {
                    return <th>{fieldName}</th>
                  })
                }
                <th></th>
              </tr>
            </thead>
            <tbody>{!filteredObjectList ? <p>Loading...</p> : this.renderTable(filteredObjectList)}</tbody>
          </table>
        </div>
      </section>
    )
  }
  
}

export default Table;