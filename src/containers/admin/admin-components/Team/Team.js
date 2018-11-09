import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditTeam';
import AddPage from './AddTeam';

import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['team_id', 'association_id', 'coach_id', 'owner_id', 'location_id', 'association_name', 'association_description'],
      itemFieldsName: ['Team ID', 'Association ID', 'Last Name of Coach', 'Last Name of Owner', 'Location Name', 'Association Name', 'Association Description'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

 componentWillMount() {
    this.props.fetchTableData('https://case-team.herokuapp.com/showAllTeamData');
  }


  componentWillReceiveProps(newProps) {
    this.doThing(newProps);
  }

  doThing(input) {

    const apiURLs = 
    ['https://case-person.herokuapp.com/showOneCoach/',
     'https://case-person.herokuapp.com/showOneOwner/',
     'http://case-address.herokuapp.com/showOneAddress/'];
    
    const apiURLfieldNames =
    ['last_name',
     'last_name',
     'location_name'];

    const columns = [2,3,4];
    let counter=0;
    input.table.data.forEach((row,i) => {
      let index = 0
      axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(first => {
        first = first.data[apiURLfieldNames[index]];
        index++;
        axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(second => {
          second = second.data[apiURLfieldNames[index]];
          index++;
          axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(third => {
            third = third.data[apiURLfieldNames[index]];
              let newRenderTable = this.state.renderTable;
              newRenderTable[i] = {
                team_id: row.team_id,
                association_id: row.association_id,
                coach_id: first,
                owner_id: second,
                location_id: third,
                association_name:row.association_name,
                association_description:row.association_description
              }
              counter++
              this.setState({ renderTable: newRenderTable })
              console.log(counter, input.table.data.length);
              if (counter > input.table.data.length/4) this.setState({ renderComplete: true })

            })
          })
        });
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Teams' addButton='Add Team' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} 
                         associationApiURL='https://case-users.herokuapp.com/updateAssociation' 
                         teamApiURL='https://case-users.herokuapp.com/updateTeam' 
                         teamDeleteURL={`https://case-users.herokuapp.com/deleteTeam/${this.state.itemToEdit.team_id}`} 
                         associationDeleteURL={`https://case-users.herokuapp.com/deleteAssociation/${this.state.itemToEdit.association_id}`} 
                         editName='Team'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} 
                        associationApiURL='https://case-users.herokuapp.com/createAssociation' 
                        teamApiURL='https://case-users.herokuapp.com/createTeam' addName='Team'/>
      default:
        break;
    }
  }

  render() {
    return ( 
      <div>
        {this.getView()}
        <NotificationContainer/>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    table: state.table
  }
}

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Team);