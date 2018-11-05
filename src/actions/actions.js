import axios from 'axios';
import { FETCH_TABLE_DATA, SET_ROW_API_HELPERS } from '../constants';

export const fetchTableData = (url) => {
  const request = axios.get(url);

  return {
    type: FETCH_TABLE_DATA,
    payload: request
  }
}

export const setRowAPIhelpers = (helperAPIs, helperAPIfields, column) => {
  return {
    type: SET_ROW_API_HELPERS,
    payload: {helperAPIs: helperAPIs, helperAPIfields: helperAPIfields, column: column}
  }
}