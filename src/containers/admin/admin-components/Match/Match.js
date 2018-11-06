import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';
import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['match_id', 'match_date', 'home_team_id', 'away_team_id', 'season_id', 'location_id'],
      itemFieldsName: ['Match ID', 'Match Date', 'Home Team', 'Away Team', 'Season', 'Location'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillMount() {
    this.props.fetchTableData('https://case-match.herokuapp.com/showMatches');
  }

  componentWillReceiveProps(newProps) {
    this.doThing(newProps);
  }

  doThing(input) {

    const apiURLs = 
    ['https://case-team.herokuapp.com/showAllTeamData/',
     'https://case-team.herokuapp.com/showAllTeamData/',
     'http://case-season.herokuapp.com/showOneSeason/',
     'http://case-address.herokuapp.com/showOneAddress/'];
    
    const apiURLfieldNames =
    ['association_name',
     'association_name',
     'name',
     'location_name'];

    const columns = [2,3,4,5];
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
            index++;
            axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(fourth => {
              fourth = fourth.data[apiURLfieldNames[index]];
              let newRenderTable = this.state.renderTable;
              newRenderTable[i] = {
                match_id: row.match_id,
                match_date: row.match_date,
                home_team_id: first,
                away_team_id: second,
                season_id: third,
                location_id:fourth
              }
              counter++
              this.setState({ renderTable: newRenderTable })
              console.log(counter, input.table.data.length);
              if (counter > input.table.data.length/4) this.setState({ renderComplete: true })

            })
          })
        });
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Matches' addButton='Add Match' helperAPI={this.state.helperAPI} helperAPIfield={this.state.helperAPIfield} />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateMatch' deleteURL={`https://case-users.herokuapp.com/deleteMatch/${this.state.itemToEdit.match_id}`} editName='Match'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createMatch' addName='Match'/>
      default:
        break;
    }
  }

  render() {
    // console.log(this.props.table, 'rendertable');
    if (!this.state.renderComplete) return 'Loading...';
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state, 'thestate');
  return {
    table: state.table
  }
}

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Address);