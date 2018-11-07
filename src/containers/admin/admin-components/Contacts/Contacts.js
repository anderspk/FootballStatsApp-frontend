import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';
import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['contact_id', 'person_id', 'contact_type', 'contact_detail'],
      itemFieldsName: ['Contact ID', 'Person', 'Contact Type', 'Contact Details'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }


  componentWillMount() {
    this.props.fetchTableData('https://case-users.herokuapp.com/showContacts');
  }

  componentWillReceiveProps(newProps) {
    this.doThing(newProps);
  }

  doThing(input) {
    let counter=0;
    input.table.data.forEach((row, i) => {
      axios.get("https://case-person.herokuapp.com/showPersons/1" + row.person_id).then(first => {
        first = first.data.first_name + ' ' + first.data.last_name;
        let newRenderTable = this.state.renderTable;
        newRenderTable[i] = {
          contact_id: row.contact_id,
          person_id: first,
          contact_type: row.contact_type,
          contact_detail: row.contact_detail
        }
          counter++
          this.setState({ renderTable: newRenderTable })
          if (counter > input.table.data.length/4) this.setState({ renderComplete: true })

      })
    })
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'table'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'table':
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Contacts' addButton='Add Contact' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateContact' deleteURL={`https://case-users.herokuapp.com/deleteContact/${this.state.itemToEdit.contact_id}`} editName='Contact'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createContact' addName='Contact'/>
      default:
        break;
    }
  }

  
  render() {
    if (!this.state.renderComplete) return 'Loading...';
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    table: state.table
  }
}

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Contacts);