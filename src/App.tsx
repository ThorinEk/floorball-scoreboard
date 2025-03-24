import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface Team {
  name: string;
  score: number;
  color: string;
}

interface EditModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ team, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(team.name);
  const [color, setColor] = useState(team.color);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(team.name);
      setColor(team.color);
    }
  }, [isOpen, team]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, color);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="team-name">Team Name</label>
            <input
              id="team-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Team Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="team-color">Team Color</label>
            <div className="color-selection">
              <input
                id="team-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <span>{color}</span>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Default team settings
  const [homeTeam, setHomeTeam] = useState<Team>({
    name: 'Home',
    score: 0,
    color: '#000000' // Default black
  });

  const [awayTeam, setAwayTeam] = useState<Team>({
    name: 'Away',
    score: 0,
    color: '#FFD700' // Default yellow
  });

  // Modal states
  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [awayModalOpen, setAwayModalOpen] = useState(false);

  // Clock state
  const [minutes, setMinutes] = useState<number>(20);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEditingClock, setIsEditingClock] = useState<boolean>(false);
  const [editMinutes, setEditMinutes] = useState<string>('20');
  const [editSeconds, setEditSeconds] = useState<string>('00');
  
  // Current time state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Interval reference for the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update current time
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    // Update once immediately
    updateCurrentTime();
    
    // Update every minute
    const timeInterval = setInterval(updateCurrentTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // Start/stop the clock
  const toggleClock = () => {
    setIsRunning(!isRunning);
  };

  // Reset the clock
  const resetClock = () => {
    setIsRunning(false);
    setMinutes(20);
    setSeconds(0);
  };

  // Increment team score
  const incrementScore = (team: 'home' | 'away') => {
    if (team === 'home') {
      setHomeTeam(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setAwayTeam(prev => ({ ...prev, score: prev.score + 1 }));
    }
  };

  // Decrement team score (not below 0)
  const decrementScore = (team: 'home' | 'away') => {
    if (team === 'home' && homeTeam.score > 0) {
      setHomeTeam(prev => ({ ...prev, score: prev.score - 1 }));
    } else if (team === 'away' && awayTeam.score > 0) {
      setAwayTeam(prev => ({ ...prev, score: prev.score - 1 }));
    }
  };

  // Save team details from modal
  const saveTeamDetails = (team: 'home' | 'away', name: string, color: string) => {
    if (team === 'home') {
      setHomeTeam(prev => ({ ...prev, name, color }));
      setHomeModalOpen(false);
    } else {
      setAwayTeam(prev => ({ ...prev, name, color }));
      setAwayModalOpen(false);
    }
  };

  // Toggle clock edit mode
  const toggleClockEdit = () => {
    if (!isRunning) {
      if (isEditingClock) {
        // Apply the edited values when leaving edit mode
        const newMinutes = parseInt(editMinutes, 10) || 0;
        const newSeconds = parseInt(editSeconds, 10) || 0;
        setMinutes(newMinutes);
        setSeconds(newSeconds);
      } else {
        // Enter edit mode with current values
        setEditMinutes(minutes.toString().padStart(2, '0'));
        setEditSeconds(seconds.toString().padStart(2, '0'));
      }
      setIsEditingClock(!isEditingClock);
    }
  };

  // Handle clock edit changes
  const handleClockChange = (type: 'minutes' | 'seconds', value: string) => {
    if (type === 'minutes') {
      setEditMinutes(value);
    } else {
      setEditSeconds(value);
    }
  };

  // Update the clock every second when running
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 0) {
                setIsRunning(false);
                if (timerRef.current) clearInterval(timerRef.current);
                return 0;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  return (
    <div className="scoreboard-container">
      <div className="current-time-wrapper">
        <div className="current-time">Current time: {currentTime}</div>
      </div>
      
      <div className="teams-container">
        <div className="team home-team" style={{ backgroundColor: homeTeam.color }}>
          <button 
            className="edit-team-btn" 
            onClick={() => setHomeModalOpen(true)}
            aria-label="Edit home team"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34l-3.75-3.75-2.53 2.54 3.75 3.75 2.53-2.54z"/>
            </svg>
          </button>
          <div className="team-name">{homeTeam.name}</div>
          <div className="score-controls">
            <button onClick={() => decrementScore('home')}>-</button>
            <div className="score">{homeTeam.score}</div>
            <button onClick={() => incrementScore('home')}>+</button>
          </div>
        </div>

        <div className="clock-container">
          {isEditingClock ? (
            <div className="clock-edit">
              <input
                type="number"
                min="0"
                max="99"
                value={editMinutes}
                onChange={(e) => handleClockChange('minutes', e.target.value)}
                className="clock-input"
              />
              :
              <input
                type="number"
                min="0"
                max="59"
                value={editSeconds}
                onChange={(e) => handleClockChange('seconds', e.target.value)}
                className="clock-input"
              />
            </div>
          ) : (
            <div className="clock">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          )}
          <div className="clock-controls">
            <button onClick={toggleClock}>{isRunning ? 'Pause' : 'Start'}</button>
            <button onClick={resetClock}>Reset</button>
            <button onClick={toggleClockEdit} disabled={isRunning}>
              {isEditingClock ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="team away-team" style={{ backgroundColor: awayTeam.color }}>
          <button 
            className="edit-team-btn" 
            onClick={() => setAwayModalOpen(true)}
            aria-label="Edit away team"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34l-3.75-3.75-2.53 2.54 3.75 3.75 2.53-2.54z"/>
            </svg>
          </button>
          <div className="team-name">{awayTeam.name}</div>
          <div className="score-controls">
            <button onClick={() => decrementScore('away')}>-</button>
            <div className="score">{awayTeam.score}</div>
            <button onClick={() => incrementScore('away')}>+</button>
          </div>
        </div>
      </div>
      
      {/* Team Edit Modals */}
      <EditModal 
        team={homeTeam}
        isOpen={homeModalOpen}
        onClose={() => setHomeModalOpen(false)}
        onSave={(name, color) => saveTeamDetails('home', name, color)}
      />
      
      <EditModal 
        team={awayTeam}
        isOpen={awayModalOpen}
        onClose={() => setAwayModalOpen(false)}
        onSave={(name, color) => saveTeamDetails('away', name, color)}
      />
    </div>
  );
};

export default App;