import React, { useState } from 'react';
import './App.css';
import DisplayTable from './order-components/DisplayTables';

const App: React.FC = () => {


  return (
    <div className="App">
      <DisplayTable limit={20}/>
    </div>
  );
}

export default App;
