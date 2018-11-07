import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from './AddResult';
import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

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

  componentWillMount() {
    this.props.fetchTableData('https://case-results.herokuapp.com/showResults');
  }

  componentWillReceiveProps(newProps) {
    this.doThing(newProps);
  }

  doThing(input) {
    let counter=0;
    input.table.data.forEach((row, i) => {
      axios.get("https://case-team.herokuapp.com/showAllTeamData/" + row.team_id).then(first => {
        first = first.data.association_name;
        let newRenderTable = this.state.renderTable;
        newRenderTable[i] = {
          match_id: row.match_id,
          team_id: first,
          score: row.score,
          result: row.result
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

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Result);