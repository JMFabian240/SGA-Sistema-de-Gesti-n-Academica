import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div>
    <h1>SGA Front-End</h1>
  </div>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
