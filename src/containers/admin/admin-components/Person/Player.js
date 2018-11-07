import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from './EditPage';
import AddPage from './AddPage';
import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['player_id', 'first_name', 'last_name', 'date_of_birth', 'address_id', 'normal_position', 'number', 'team_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address ID', 'Normal Position', 'Number', 'Team'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id', 'normal_position', 'number', 'team_id'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillMount() {
    this.props.fetchTableData('https://case-person.herokuapp.com/showPlayers');
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
          player_id: row.player_id,
          first_name: row.first_name,
          last_name: row.last_name,
          date_of_birth: row.date_of_birth,
          address_id: row.address_id,
          normal_position: row.normal_position,
          number: row.number,
          team_id: first
        }
          counter++
          this.setState({ renderTable: newRenderTable })
          if (counter > input.table.data.length/4) this.setState({ renderComplete: true })

      })
    })

    axios.get('https://case-team.herokuapp.com/showAllTeamData/')
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'personTable'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'personTable':
        return <PeopleTable objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Player' addButton='Add Player' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updatePlayer' deleteURL={`https://case-users.herokuapp.com/deletePlayer/${this.state.itemToEdit.player_id}`} editName='Player'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createPlayer' addName='Player'/>
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


const mapStateToProps = state => {
  return {
    table: state.table
  }
}

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Player);