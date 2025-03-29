import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
// Import sounds
import goalSound from './assets/sounds/goal.mp3';
import endHornSound from './assets/sounds/end-horn.mp3';
// Import the LogoStripe component
import LogoStripe from './components/LogoStripe';

// Game mode enum
enum GameMode {
  TIME_BASED = 'time',
  GOAL_BASED = 'goal'
}

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

interface SoundSettings {
  maxDuration: number;
  fadeOutDuration: number;
  volume: number;
}

// Updated settings interface to include game mode and goal limit
interface GameSettings {
  soundSettings: SoundSettings;
  gameMode: GameMode;
  goalLimit: number;
  matchDuration: number; // in minutes, for time-based mode
}

// Updated settings modal props
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameSettings: GameSettings;
  onSave: (settings: GameSettings) => void;
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

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, gameSettings, onSave }) => {
  const [maxDuration, setMaxDuration] = useState(gameSettings.soundSettings.maxDuration);
  const [fadeOutDuration, setFadeOutDuration] = useState(gameSettings.soundSettings.fadeOutDuration);
  const [volume, setVolume] = useState(gameSettings.soundSettings.volume);
  const [gameMode, setGameMode] = useState(gameSettings.gameMode);
  const [goalLimit, setGoalLimit] = useState(gameSettings.goalLimit);
  const [matchDuration, setMatchDuration] = useState(gameSettings.matchDuration);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMaxDuration(gameSettings.soundSettings.maxDuration);
      setFadeOutDuration(gameSettings.soundSettings.fadeOutDuration);
      setVolume(gameSettings.soundSettings.volume);
      setGameMode(gameSettings.gameMode);
      setGoalLimit(gameSettings.goalLimit);
      setMatchDuration(gameSettings.matchDuration);
    }
  }, [isOpen, gameSettings]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      soundSettings: {
        maxDuration,
        fadeOutDuration,
        volume
      },
      gameMode,
      goalLimit,
      matchDuration
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <h2>Game Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Game Mode</label>
            <div className="game-mode-selection">
              <label className="radio-option">
                <input
                  type="radio"
                  name="gameMode"
                  value={GameMode.TIME_BASED}
                  checked={gameMode === GameMode.TIME_BASED}
                  onChange={() => setGameMode(GameMode.TIME_BASED)}
                />
                <span>Time-based (countdown)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="gameMode"
                  value={GameMode.GOAL_BASED}
                  checked={gameMode === GameMode.GOAL_BASED}
                  onChange={() => setGameMode(GameMode.GOAL_BASED)}
                />
                <span>Goal-based (first to score limit)</span>
              </label>
            </div>
          </div>
          
          {gameMode === GameMode.TIME_BASED ? (
            <div className="form-group">
              <label htmlFor="match-duration">Match Duration (minutes)</label>
              <input
                id="match-duration"
                type="number"
                min="1"
                max="90"
                value={matchDuration}
                onChange={(e) => setMatchDuration(parseInt(e.target.value) || 20)}
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="goal-limit">Goal Limit to Win</label>
              <input
                id="goal-limit"
                type="number"
                min="1"
                max="50"
                value={goalLimit}
                onChange={(e) => setGoalLimit(parseInt(e.target.value) || 10)}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Sounds</label>
            <div className="sound-settings">
              <div className="volume-control">
                <label htmlFor="volume-control">Volume</label>
                <div className="range-control">
                  <input
                    id="volume-control"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                  />
                  <span className="range-value">{Math.round(volume * 100)}%</span>
                </div>
              </div>
              
              <div className="goal-sound-settings">
                <h4>Goal Sound Settings</h4>
                <div className="range-control">
                  <label htmlFor="max-duration">Duration (seconds)</label>
                  <input
                    id="max-duration"
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                  />
                  <span className="range-value">{maxDuration}s</span>
                </div>
                
                <div className="range-control">
                  <label htmlFor="fade-duration">Fade Out (seconds)</label>
                  <input
                    id="fade-duration"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={fadeOutDuration}
                    onChange={(e) => setFadeOutDuration(Number(e.target.value))}
                  />
                  <span className="range-value">{fadeOutDuration}s</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="settings-info">
            {gameMode === GameMode.TIME_BASED ? (
              <p>In Time-based mode, the game ends when the timer reaches zero.</p>
            ) : (
              <p>In Goal-based mode, the first team to reach {goalLimit} goals wins. Timer shows elapsed time.</p>
            )}
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

  // Game settings state
  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    try {
      // Load settings from localStorage if available
      const savedSettings = localStorage.getItem('gameSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return {
          soundSettings: {
            maxDuration: isFinite(parsed.soundSettings?.maxDuration) ? parsed.soundSettings.maxDuration : 15,
            fadeOutDuration: isFinite(parsed.soundSettings?.fadeOutDuration) ? parsed.soundSettings.fadeOutDuration : 2,
            volume: isFinite(parsed.soundSettings?.volume) ? 
              Math.min(Math.max(parsed.soundSettings.volume, 0), 1) : 0.7
          },
          gameMode: Object.values(GameMode).includes(parsed.gameMode) ? parsed.gameMode : GameMode.TIME_BASED,
          goalLimit: isFinite(parsed.goalLimit) ? parsed.goalLimit : 10,
          matchDuration: isFinite(parsed.matchDuration) ? parsed.matchDuration : 20
        };
      }
    } catch (error) {
      console.error("Error loading game settings:", error);
    }
    
    // Default settings if loading fails
    return {
      soundSettings: {
        maxDuration: 15,
        fadeOutDuration: 2,
        volume: 0.7
      },
      gameMode: GameMode.TIME_BASED,
      goalLimit: 10,
      matchDuration: 20
    };
  });

  // Clock state
  const [minutes, setMinutes] = useState<number>(gameSettings.matchDuration);
  const [seconds, setSeconds] = useState<number>(0);
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0); // For goal-based mode
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0); // For goal-based mode
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEditingClock, setIsEditingClock] = useState<boolean>(false);
  const [editMinutes, setEditMinutes] = useState<string>(gameSettings.matchDuration.toString());
  const [editSeconds, setEditSeconds] = useState<string>('00');
  
  // Current time state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Game state
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winningTeam, setWinningTeam] = useState<string | null>(null);

  // Sound state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endHornRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Add timer ref declaration
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Settings state
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
    } catch (error) {
      console.error("Error saving game settings:", error);
    }
  }, [gameSettings]);

  // Initialize audio
  useEffect(() => {
    try {
      audioRef.current = new Audio(goalSound);
      endHornRef.current = new Audio(endHornSound);
      
      if (audioRef.current && endHornRef.current) {
        // Ensure volume is a valid number between 0 and 1
        const safeVolume = isFinite(gameSettings.soundSettings.volume) ? 
          Math.min(Math.max(gameSettings.soundSettings.volume, 0), 1) : 0.7;
        audioRef.current.volume = safeVolume;
        endHornRef.current.volume = safeVolume;
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }, [gameSettings.soundSettings.volume]);

  // Clean up function for sound - wrap in useCallback
  const cleanupSound = useCallback(() => {
    try {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
        fadeInterval.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      if (endHornRef.current) {
        endHornRef.current.pause();
        endHornRef.current.currentTime = 0;
      }
    } catch (error) {
      console.error("Error cleaning up sound:", error);
    }
  }, []);

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

  // Play sounds
  const playGoalSound = useCallback(() => {
    try {
      const safeVolume = isFinite(gameSettings.soundSettings.volume) ? 
        Math.min(Math.max(gameSettings.soundSettings.volume, 0), 1) : 0.7;
      
      if (safeVolume > 0 && audioRef.current) {
        cleanupSound();
        audioRef.current.volume = safeVolume;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Error playing goal sound:", error);
        });
        
        const maxDuration = isFinite(gameSettings.soundSettings.maxDuration) ? 
          Math.max(gameSettings.soundSettings.maxDuration, 1) : 15;
        const fadeOutDuration = isFinite(gameSettings.soundSettings.fadeOutDuration) ? 
          Math.min(Math.max(gameSettings.soundSettings.fadeOutDuration, 0), maxDuration) : 2;
        
        const fadeStartTime = maxDuration - fadeOutDuration;
        
        if (fadeOutDuration > 0) {
          setTimeout(() => {
            if (audioRef.current && !audioRef.current.paused) {
              const fadeSteps = 20;
              const fadeStepTime = (fadeOutDuration * 1000) / fadeSteps;
              let currentStep = 0;
              
              fadeInterval.current = setInterval(() => {
                currentStep++;
                
                if (currentStep >= fadeSteps || !audioRef.current) {
                  cleanupSound();
                } else {
                  const newVolume = safeVolume * (1 - currentStep / fadeSteps);
                  if (audioRef.current && isFinite(newVolume)) {
                    audioRef.current.volume = newVolume;
                  }
                }
              }, fadeStepTime);
            }
          }, fadeStartTime * 1000);
        }
        
        setTimeout(() => {
          cleanupSound();
        }, maxDuration * 1000);
      }
    } catch (error) {
      console.error("Error playing goal sound:", error);
    }
  }, [cleanupSound, gameSettings.soundSettings]);

  const playEndHorn = useCallback(() => {
    try {
      const safeVolume = isFinite(gameSettings.soundSettings.volume) ? 
        Math.min(Math.max(gameSettings.soundSettings.volume, 0), 1) : 0.7;
        
      if (safeVolume > 0 && endHornRef.current) {
        cleanupSound();
        endHornRef.current.volume = safeVolume;
        endHornRef.current.currentTime = 0;
        endHornRef.current.play().catch(error => {
          console.error("Error playing end horn sound:", error);
        });
      }
    } catch (error) {
      console.error("Error playing end horn sound:", error);
    }
  }, [cleanupSound, gameSettings.soundSettings.volume]);

  const toggleClock = () => {
    setIsRunning(!isRunning);
  };

  const resetGame = () => {
    setIsRunning(false);
    
    if (gameSettings.gameMode === GameMode.TIME_BASED) {
      setMinutes(gameSettings.matchDuration);
      setSeconds(0);
    } else {
      setElapsedMinutes(0);
      setElapsedSeconds(0);
    }
    
    setHomeTeam(prev => ({ ...prev, score: 0 }));
    setAwayTeam(prev => ({ ...prev, score: 0 }));
    setGameEnded(false);
    setWinningTeam(null);
  };

  const incrementScore = (team: 'home' | 'away') => {
    if (gameEnded) return;
    
    if (team === 'home') {
      const newScore = homeTeam.score + 1;
      setHomeTeam(prev => ({ ...prev, score: newScore }));
      
      if (gameSettings.gameMode === GameMode.GOAL_BASED && newScore >= gameSettings.goalLimit) {
        endGame(homeTeam.name);
      }
    } else {
      const newScore = awayTeam.score + 1;
      setAwayTeam(prev => ({ ...prev, score: newScore }));
      
      if (gameSettings.gameMode === GameMode.GOAL_BASED && newScore >= gameSettings.goalLimit) {
        endGame(awayTeam.name);
      }
    }
    
    playGoalSound();
  };

  const endGame = (winner: string | null) => {
    setIsRunning(false);
    setGameEnded(true);
    setWinningTeam(winner);
    playEndHorn();
  };

  const decrementScore = (team: 'home' | 'away') => {
    if (gameEnded) return;
    
    if (team === 'home' && homeTeam.score > 0) {
      setHomeTeam(prev => ({ ...prev, score: prev.score - 1 }));
    } else if (team === 'away' && awayTeam.score > 0) {
      setAwayTeam(prev => ({ ...prev, score: prev.score - 1 }));
    }
  };

  const saveTeamDetails = (team: 'home' | 'away', name: string, color: string) => {
    if (team === 'home') {
      setHomeTeam(prev => ({ ...prev, name, color }));
      setHomeModalOpen(false);
    } else {
      setAwayTeam(prev => ({ ...prev, name, color }));
      setAwayModalOpen(false);
    }
  };

  const saveGameSettings = (settings: GameSettings) => {
    setGameSettings(settings);
    
    setIsRunning(false);
    
    if (settings.gameMode === GameMode.TIME_BASED) {
      setMinutes(settings.matchDuration);
      setSeconds(0);
      setEditMinutes(settings.matchDuration.toString());
      setEditSeconds('00');
    } else {
      setElapsedMinutes(0);
      setElapsedSeconds(0);
    }
    
    setGameEnded(false);
    setWinningTeam(null);
    setSettingsModalOpen(false);
  };

  const toggleClockEdit = () => {
    if (!isRunning && gameSettings.gameMode === GameMode.TIME_BASED) {
      if (isEditingClock) {
        const newMinutes = parseInt(editMinutes, 10) || 0;
        const newSeconds = parseInt(editSeconds, 10) || 0;
        setMinutes(newMinutes);
        setSeconds(newSeconds);
      } else {
        setEditMinutes(minutes.toString().padStart(2, '0'));
        setEditSeconds(seconds.toString().padStart(2, '0'));
      }
      setIsEditingClock(!isEditingClock);
    }
  };

  const handleClockChange = (type: 'minutes' | 'seconds', value: string) => {
    if (type === 'minutes') {
      setEditMinutes(value);
    } else {
      setEditSeconds(value);
    }
  };

  useEffect(() => {
    if (isRunning && !gameEnded) {
      timerRef.current = setInterval(() => {
        if (gameSettings.gameMode === GameMode.TIME_BASED) {
          setSeconds(prevSeconds => {
            if (prevSeconds === 0) {
              setMinutes(prevMinutes => {
                if (prevMinutes === 0) {
                  endGame(null);
                  if (timerRef.current) clearInterval(timerRef.current);
                  return 0;
                }
                return prevMinutes - 1;
              });
              return minutes > 0 ? 59 : 0;
            }
            return prevSeconds - 1;
          });
        } else {
          setElapsedSeconds(prevSeconds => {
            if (prevSeconds === 59) {
              setElapsedMinutes(prevMinutes => prevMinutes + 1);
              return 0;
            }
            return prevSeconds + 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, gameEnded, minutes, gameSettings.gameMode, endGame]);

  const getClockDisplay = () => {
    if (gameSettings.gameMode === GameMode.TIME_BASED) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')}`;
    }
  };

  const getGameStatusDisplay = () => {
    if (!gameEnded) return null;
    
    if (gameSettings.gameMode === GameMode.TIME_BASED) {
      if (homeTeam.score === awayTeam.score) {
        return (
          <div className="game-ended-display">
            <div className="pulsating-text">TIME'S UP!</div>
            <div className="result-text">IT'S A DRAW!</div>
          </div>
        );
      } else {
        const winner = homeTeam.score > awayTeam.score ? homeTeam.name : awayTeam.name;
        return (
          <div className="game-ended-display">
            <div className="pulsating-text">TIME'S UP!</div>
            <div className="result-text">{winner} WINS!</div>
          </div>
        );
      }
    } else {
      return (
        <div className="game-ended-display">
          <div className="pulsating-text">GAME OVER!</div>
          <div className="result-text">{winningTeam} WINS!</div>
        </div>
      );
    }
  };

  return (
    <div className="scoreboard-container">
      <div className="header-row">
        <div className="current-time">Current time: {currentTime}</div>
        <div className="header-controls">
          <button 
            className="settings-btn" 
            onClick={() => setSettingsModalOpen(true)}
            aria-label="Game settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22-.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="main-content">
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
            <div className="score-display">
              <div className="score">{homeTeam.score}</div>
            </div>
            <div className="score-controls">
              <button onClick={() => decrementScore('home')} disabled={gameEnded}>−</button>
              <button onClick={() => incrementScore('home')} disabled={gameEnded}>+</button>
            </div>
          </div>

          <div className="clock-container">
            {isEditingClock && gameSettings.gameMode === GameMode.TIME_BASED ? (
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
              <div className={`clock ${gameEnded ? 'game-ended' : ''}`}>
                {gameEnded ? (
                  getGameStatusDisplay()
                ) : (
                  <>
                    {getClockDisplay()}
                    {gameSettings.gameMode === GameMode.GOAL_BASED && (
                      <div className="goal-limit-info">
                        First to {gameSettings.goalLimit} wins
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="clock-controls">
              <button onClick={toggleClock} disabled={gameEnded}>
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetGame}>Reset</button>
              {gameSettings.gameMode === GameMode.TIME_BASED && (
                <button onClick={toggleClockEdit} disabled={isRunning || gameEnded}>
                  {isEditingClock ? 'Save' : 'Edit'}
                </button>
              )}
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
            <div className="score-display">
              <div className="score">{awayTeam.score}</div>
            </div>
            <div className="score-controls">
              <button onClick={() => decrementScore('away')} disabled={gameEnded}>−</button>
              <button onClick={() => incrementScore('away')} disabled={gameEnded}>+</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add the LogoStripe component */}
      <LogoStripe />
      
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
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        gameSettings={gameSettings}
        onSave={saveGameSettings}
      />
    </div>
  );
};

export default App;