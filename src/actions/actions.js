import axios from 'axios';
import { FETCH_TABLE_DATA } from '../constants';

export const fetchTableData = (url) => {
  const request = axios.get(url);

  return {
    type: FETCH_TABLE_DATA,
    payload: request
  }
}