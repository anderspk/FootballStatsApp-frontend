import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';
import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

class Goals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['goal_id', 'player_id', 'goal_type_id', 'match_id', 'description'],
      itemFieldsName: ['Goal ID', 'Player', 'Goal type ID', 'Match ID', 'Description'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }


  componentWillMount() {
    this.props.fetchTableData('https://case-goal.herokuapp.com/showGoals');
  }

  componentWillReceiveProps(newProps) {
    this.doThing(newProps);
  }

  doThing(input) {
    let counter=0;
    input.table.data.forEach((row, i) => {
      axios.get("https://case-person.herokuapp.com/showOnePlayer/" + row.player_id).then(first => {
        first = first.data.first_name + ' ' + first.data.last_name;
        let newRenderTable = this.state.renderTable;
        newRenderTable[i] = {
          goal_id: row.goal_id,
          player_id: first,
          goal_type_id: row.goal_type_id,
          match_id: row.match_id,
          description: row.description
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Goals' addButton='Add Goal' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateGoal' deleteURL={`https://case-users.herokuapp.com/deleteGoal/${this.state.itemToEdit.goal_id}`}editName='Goal'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createGoal' addName='Goal' />
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

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Goals);