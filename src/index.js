import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Site Imports
import Admin from './containers/admin/Admin';

ReactDOM.render(<Admin />, document.getElementById('root'));


serviceWorker.unregister();