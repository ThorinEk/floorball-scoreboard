import React, { useState, useEffect } from 'react';
import './App.css';

interface Team {
  name: string;
  score: number;
}

function App() {
  const [homeTeam, setHomeTeam] = useState<Team>({ name: 'Home', score: 0 });
  const [awayTeam, setAwayTeam] = useState<Team>({ name: 'Away', score: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const incrementScore = (team: 'home' | 'away') => {
    if (team === 'home') {
      setHomeTeam(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setAwayTeam(prev => ({ ...prev, score: prev.score + 1 }));
    }
  };

  const decrementScore = (team: 'home' | 'away') => {
    if (team === 'home' && homeTeam.score > 0) {
      setHomeTeam(prev => ({ ...prev, score: prev.score - 1 }));
    } else if (team === 'away' && awayTeam.score > 0) {
      setAwayTeam(prev => ({ ...prev, score: prev.score - 1 }));
    }
  };

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1200); // Reset to 20 minutes
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Floorball Scoreboard</h1>
        
        <div className="timer">
          <h2>{formatTime(timeLeft)}</h2>
          <div className="timer-controls">
            <button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
            <button onClick={resetTimer}>Reset</button>
          </div>
        </div>
        
        <div className="scoreboard">
          <div className="team home">
            <h2>{homeTeam.name}</h2>
            <div className="score">{homeTeam.score}</div>
            <div className="controls">
              <button onClick={() => incrementScore('home')}>+</button>
              <button onClick={() => decrementScore('home')}>-</button>
            </div>
            <input 
              type="text" 
              value={homeTeam.name}
              onChange={(e) => setHomeTeam(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="team away">
            <h2>{awayTeam.name}</h2>
            <div className="score">{awayTeam.score}</div>
            <div className="controls">
              <button onClick={() => incrementScore('away')}>+</button>
              <button onClick={() => decrementScore('away')}>-</button>
            </div>
            <input 
              type="text" 
              value={awayTeam.name}
              onChange={(e) => setAwayTeam(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;