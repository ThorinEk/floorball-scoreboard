import React from 'react';

interface ControlsProps {
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onStart, onPause, onReset }) => {
    return (
        <div className="controls">
            <button onClick={onStart}>Start</button>
            <button onClick={onPause}>Pause</button>
            <button onClick={onReset}>Reset</button>
        </div>
    );
};

export default Controls;