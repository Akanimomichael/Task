import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { FlowProvider } from './store/FlowContext';

ReactDOM.render(
  <React.StrictMode>
    <FlowProvider>
      <App />
    </FlowProvider>
  </React.StrictMode>,
  document.getElementById('root')
); 