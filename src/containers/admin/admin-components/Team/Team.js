import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['team_id', 'association_id', 'coach_id', 'owner_id', 'location_id', 'association_name', 'association_description'],
      itemFieldsName: ['Team ID', 'Association ID', 'Coach ID', 'Owner ID', 'Location ID', 'Association Name', 'Association Description']
    }
    this.getData();
    this.onEdit = this.onEdit.bind(this);
  }

  getData() {
    axios.get('https://case-team.herokuapp.com/showTeams')
      .then(response => this.setState({ data: response.data }));
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
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Teams' addButton='Add Team' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateTeam' editName='Team'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createTeam' />
      default:
        break;
    }
  }

  render() {
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default Team;