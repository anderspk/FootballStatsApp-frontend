import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditResult';
import AddPage from './AddResult';

class Result extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['match_id', 'team_id', 'score', 'result'],
      itemFieldsName: ['Match ID', 'Team', 'Score', 'Result'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

componentDidMount() {
    
    const resuls = axios.get("https://case-results.herokuapp.com/showResults");
    const teams = axios.get("https://case-team.herokuapp.com/showAllTeamData/");

    Promise.all([resuls, teams]).then(values => {
      const renderTable = [];
      values[0].data.forEach((result, i) => {
        const team = values[1].data.find(team => team.team_id === result.team_id);
        renderTable[i] = {
          match_id: result.match_id,
          team_id: team.association_name,
          score: result.score,
          result: result.result
        }
      });
      this.setState({ renderTable: renderTable, values:values});
    });
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});

    editItem.match_id = this.state.values[0].data.find(row => editItem.match_id.includes(row.match_id)).match_id;
    editItem.team_id = this.state.values[1].data.find(row => row.association_name === editItem.team_id).team_id;
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Results' addButton='Add Result' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL={`https://case-users.herokuapp.com/updateResult/${this.state.itemToEdit.team_id}/${this.state.itemToEdit.match_id}`} deleteURL={`https://case-users.herokuapp.com/deleteResult/${this.state.itemToEdit.match_id}/${this.state.itemToEdit.team_id}`} editName='Result'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createResult/' addName='Result' />
      default:
        break;
    }
  }

  render() {
    if (!this.state.renderTable) return 'Loading...';
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default Result;