import React, { Component } from 'react';

class TableRow extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { row, itemFields } = this.props;
    console.log(row, 'row')
    return (
      <tr>
          {this.props.itemFields.map(fieldName => {
              return (
                  <td>{row[fieldName]} </td>
                )
            })}
            <td><button className="btn btn-info" onClick={e => {this.props.onEdit(row)}} >Edit</button></td>
        </tr>
    )
  }
}

export default TableRow;