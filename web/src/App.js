import React from 'react';

function App(props) {
  return (
    <div className="App">
      <h1>App</h1>
      {props.children}
    </div>
  );
}

export default App;
