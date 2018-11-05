import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class TableRow extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    const newState = {};
    let counter = 0;
    this.props.itemFields.forEach((fieldName, i)=> {
      let apiCounter = counter%(this.props.rowAPI.data.helperAPIs.length-1);

      newState[fieldName] = this.props.row[fieldName];
      if (this.props.rowAPI.data.column.includes(i)) {
        axios.get(this.props.rowAPI.data.helperAPIs[apiCounter] + this.props.row[fieldName]).then(response => this.setState({...this.state, [fieldName]: response.data[this.props.rowAPI.data.helperAPIfields[apiCounter]]}));
        counter++;
      }
    })
    this.setState(newState);
  }

  render() {
    const { row, itemFields } = this.props;
    return (
      <tr>
          {itemFields.map(fieldName => {
              return (
                  <td>{this.state[fieldName]}</td>
                )
            })}
            <td><button className="btn btn-info" onClick={e => {this.props.onEdit(row)}} >Edit</button></td>
        </tr>
    )
  }
}

const mapStateToProps = state => {
  return {
    rowAPI: state.rowAPI
  }
}

export default connect(mapStateToProps)(TableRow);