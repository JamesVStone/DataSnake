import React from 'react';
import './App.css';
import SnakeGame from './components/SnakeGame/SnakeGame'

function App() {
  return (
    <div className="App">
      <SnakeGame 
        width={50}
        height={50}
      />
    </div>
  );
}

export default App;
