import React from 'react';

interface ScoreboardProps {
    teamAName: string;
    teamBName: string;
    teamAScore: number;
    teamBScore: number;
    timer: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teamAName, teamBName, teamAScore, teamBScore, timer }) => {
    return (
        <div className="scoreboard">
            <div className="team">
                <h2>{teamAName}</h2>
                <p>{teamAScore}</p>
            </div>
            <div className="timer">
                <h2>{timer}</h2>
            </div>
            <div className="team">
                <h2>{teamBName}</h2>
                <p>{teamBScore}</p>
            </div>
        </div>
    );
};

export default Scoreboard;