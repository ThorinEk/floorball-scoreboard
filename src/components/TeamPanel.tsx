import React from 'react';

interface TeamPanelProps {
    teamName: string;
    score: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onNameChange: (name: string) => void;
}

const TeamPanel: React.FC<TeamPanelProps> = ({ teamName, score, onIncrement, onDecrement, onNameChange }) => {
    return (
        <div className="team-panel">
            <input
                type="text"
                value={teamName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Team Name"
                className="team-name-input"
            />
            <div className="score-display">{score}</div>
            <div className="score-controls">
                <button onClick={onIncrement} className="score-button">+</button>
                <button onClick={onDecrement} className="score-button">-</button>
            </div>
        </div>
    );
};

export default TeamPanel;