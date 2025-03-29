import React, { useState, useEffect, useRef } from 'react';
import './App.css';
// Import sounds
import goalSound from './assets/sounds/goal.mp3';
import endHornSound from './assets/sounds/end-horn.mp3';
// Import the LogoStripe component
import LogoStripe from './components/LogoStripe';

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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundSettings: SoundSettings;
  onSave: (settings: SoundSettings) => void;
}

// Sound indicator component

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

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, soundSettings, onSave }) => {
  const [maxDuration, setMaxDuration] = useState(soundSettings.maxDuration);
  const [fadeOutDuration, setFadeOutDuration] = useState(soundSettings.fadeOutDuration);
  const [volume, setVolume] = useState(soundSettings.volume);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMaxDuration(soundSettings.maxDuration);
      setFadeOutDuration(soundSettings.fadeOutDuration);
      setVolume(soundSettings.volume);
    }
  }, [isOpen, soundSettings]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      maxDuration,
      fadeOutDuration,
      volume
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sound Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="max-duration">Goal Sound Duration (seconds)</label>
            <div className="range-control">
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
          </div>
          <div className="form-group">
            <label htmlFor="fade-duration">Fade Out Duration (seconds)</label>
            <div className="range-control">
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
          <div className="settings-info">
            <p>The goal celebration sound will play at {Math.round(volume * 100)}% volume for {maxDuration} seconds
              {fadeOutDuration > 0 ? ` with a ${fadeOutDuration} second fade-out at the end` : ''}.
            </p>
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

  // Add game-ended state
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  // Sound state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endHornRef = useRef<HTMLAudioElement | null>(null); // New ref for end horn
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Settings state
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    try {
      // Load settings from localStorage if available
      const savedSettings = localStorage.getItem('soundSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return {
          maxDuration: isFinite(parsed.maxDuration) ? parsed.maxDuration : 15,
          fadeOutDuration: isFinite(parsed.fadeOutDuration) ? parsed.fadeOutDuration : 2,
          volume: isFinite(parsed.volume) ? Math.min(Math.max(parsed.volume, 0), 1) : 0.7 // Clamp between 0 and 1
        };
      }
    } catch (error) {
      console.error("Error loading sound settings:", error);
    }
    // Default settings if loading fails
    return {
      maxDuration: 15, // Default to 15 seconds
      fadeOutDuration: 2, // Default to 2 second fade out
      volume: 0.7 // Default to 70% volume
    };
  });

  // State to determine if sound is muted (volume is zero)

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('soundSettings', JSON.stringify(soundSettings));
    } catch (error) {
      console.error("Error saving sound settings:", error);
    }
  }, [soundSettings]);

  // Initialize audio
  useEffect(() => {
    try {
      audioRef.current = new Audio(goalSound);
      endHornRef.current = new Audio(endHornSound); // Initialize the end horn sound
      
      if (audioRef.current) {
        // Ensure volume is a valid number between 0 and 1
        const safeVolume = isFinite(soundSettings.volume) ? 
          Math.min(Math.max(soundSettings.volume, 0), 1) : 0.7;
        audioRef.current.volume = safeVolume;
      }
      
      if (endHornRef.current) {
        // Apply same volume settings to end horn
        const safeVolume = isFinite(soundSettings.volume) ? 
          Math.min(Math.max(soundSettings.volume, 0), 1) : 0.7;
        endHornRef.current.volume = safeVolume;
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }, [soundSettings.volume]);

  // Update audio volume when volume state changes
  useEffect(() => {
    try {
      if (audioRef.current) {
        // Ensure volume is a valid number between 0 and 1
        const safeVolume = isFinite(soundSettings.volume) ? 
          Math.min(Math.max(soundSettings.volume, 0), 1) : 0.7;
        audioRef.current.volume = safeVolume;
      }
      
      // Also update end horn volume
      if (endHornRef.current) {
        const safeVolume = isFinite(soundSettings.volume) ? 
          Math.min(Math.max(soundSettings.volume, 0), 1) : 0.7;
        endHornRef.current.volume = safeVolume;
      }
    } catch (error) {
      console.error("Error updating audio volume:", error);
    }
  }, [soundSettings.volume]);

  // Clean up function for sound - wrap in useCallback
  const cleanupSound = React.useCallback(() => {
    try {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
        fadeInterval.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Also clean up end horn if needed
      if (endHornRef.current) {
        endHornRef.current.pause();
        endHornRef.current.currentTime = 0;
      }
    } catch (error) {
      console.error("Error cleaning up sound:", error);
    }
  }, []); // No dependencies since we're only using refs

  // Play goal sound with duration limit and fade
  const playGoalSound = () => {
    try {
      // Ensure volume is a valid number greater than 0
      const safeVolume = isFinite(soundSettings.volume) ? 
        Math.min(Math.max(soundSettings.volume, 0), 1) : 0.7;
        
      if (safeVolume > 0 && audioRef.current) {
        // Clean up any existing playback
        cleanupSound();
        
        // Reset to full volume based on user's setting
        audioRef.current.volume = safeVolume;
        
        // Start playing
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Error playing goal sound:", error);
        });
        
        // Get safe values for duration settings
        const maxDuration = isFinite(soundSettings.maxDuration) ? 
          Math.max(soundSettings.maxDuration, 1) : 15;
        const fadeOutDuration = isFinite(soundSettings.fadeOutDuration) ? 
          Math.min(Math.max(soundSettings.fadeOutDuration, 0), maxDuration) : 2;
        
        // Calculate when to start fading out
        const fadeStartTime = maxDuration - fadeOutDuration;
        
        // Set timeout to start the fade out process
        if (fadeOutDuration > 0) {
          setTimeout(() => {
            // Start fade out if the audio is still playing
            if (audioRef.current && !audioRef.current.paused) {
              const fadeSteps = 20; // Number of steps for the fade
              const fadeStepTime = (fadeOutDuration * 1000) / fadeSteps;
              let currentStep = 0;
              
              fadeInterval.current = setInterval(() => {
                currentStep++;
                
                if (currentStep >= fadeSteps || !audioRef.current) {
                  // End of fade
                  cleanupSound();
                } else {
                  // Calculate new volume for this step
                  const newVolume = safeVolume * (1 - currentStep / fadeSteps);
                  if (audioRef.current && isFinite(newVolume)) {
                    audioRef.current.volume = newVolume;
                  }
                }
              }, fadeStepTime);
            }
          }, fadeStartTime * 1000);
        }
        
        // Set timeout to stop the sound after maxDuration
        setTimeout(() => {
          cleanupSound();
        }, maxDuration * 1000);
      }
    } catch (error) {
      console.error("Error playing goal sound:", error);
    }
  };

  // Define playEndHorn with useCallback using the memoized cleanupSound
  const playEndHorn = React.useCallback(() => {
    try {
      // Ensure volume is a valid number greater than 0
      const safeVolume = isFinite(soundSettings.volume) ? 
        Math.min(Math.max(soundSettings.volume, 0), 1) : 0.7;
        
      if (safeVolume > 0 && endHornRef.current) {
        // Clean up any existing playback
        cleanupSound();
        
        // Set volume and play
        endHornRef.current.volume = safeVolume;
        endHornRef.current.currentTime = 0;
        endHornRef.current.play().catch(error => {
          console.error("Error playing end horn sound:", error);
        });
      }
    } catch (error) {
      console.error("Error playing end horn sound:", error);
    }
  }, [soundSettings.volume, cleanupSound]); // cleanupSound is now stable

  // Save sound settings
  const saveSoundSettings = (settings: SoundSettings) => {
    // Validate and sanitize values before saving
    const sanitizedSettings = {
      maxDuration: isFinite(settings.maxDuration) ? 
        Math.max(settings.maxDuration, 1) : 15,
      fadeOutDuration: isFinite(settings.fadeOutDuration) ? 
        Math.min(Math.max(settings.fadeOutDuration, 0), settings.maxDuration) : 2,
      volume: isFinite(settings.volume) ? 
        Math.min(Math.max(settings.volume, 0), 1) : 0.7
    };
    
    setSoundSettings(sanitizedSettings);
    setSettingsModalOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, [cleanupSound]); // Don't forget to update this dependency as well

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
    setGameEnded(false); // Reset game ended state
  };

  // Increment team score and play sound
  const incrementScore = (team: 'home' | 'away') => {
    if (team === 'home') {
      setHomeTeam(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setAwayTeam(prev => ({ ...prev, score: prev.score + 1 }));
    }
    // Play goal sound when score is incremented
    playGoalSound();
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
                // Game has ended
                setIsRunning(false);
                setGameEnded(true); // Set game ended flag
                playEndHorn(); // Play the end horn sound
                if (timerRef.current) clearInterval(timerRef.current);
                return 0; // Keep at 0, don't reset to 59
              }
              return prevMinutes - 1;
            });
            // Only return 59 if minutes didn't reach 0
            return minutes > 0 ? 59 : 0;
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
  }, [isRunning, minutes, playEndHorn]); // Add playEndHorn to dependency array

  return (
    <div className="scoreboard-container">
      <div className="header-row">
        <div className="current-time">Current time: {currentTime}</div>
        <div className="header-controls">
          <button 
            className="settings-btn" 
            onClick={() => setSettingsModalOpen(true)}
            aria-label="Sound settings"
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
              <button onClick={() => decrementScore('home')}>−</button>
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
              <div className={`clock ${gameEnded ? 'game-ended' : ''}`}>
                {gameEnded ? (
                  <div className="game-ended-display">
                    <div className="pulsating-text">GAME ENDED</div>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                ) : (
                  <>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>
                )}
              </div>
            )}
            <div className="clock-controls">
              <button onClick={toggleClock} disabled={gameEnded}>
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetClock}>Reset</button>
              <button onClick={toggleClockEdit} disabled={isRunning || gameEnded}>
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
            <div className="score-display">
              <div className="score">{awayTeam.score}</div>
            </div>
            <div className="score-controls">
              <button onClick={() => decrementScore('away')}>−</button>
              <button onClick={() => incrementScore('away')}>+</button>
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
        soundSettings={soundSettings}
        onSave={saveSoundSettings}
      />
    </div>
  );
};

export default App;