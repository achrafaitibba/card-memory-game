import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Settings() {
    const dispatch = useDispatch();
    const { gameMode, background } = useSelector(state => state);

    const backgrounds = [
        { id: 'orange-purple', name: 'Orange Purple' },
        { id: 'blue-green', name: 'Blue Green' },
        { id: 'pink-yellow', name: 'Pink Yellow' }
    ];

    const gameModes = [
        { value: 4, name: '2x2' },
        { value: 16, name: '4x4' },
        { value: 64, name: '8x8' }
    ];

    const handleModeChange = (mode) => {
        dispatch({ type: 'CHANGE_MODE', mode });
        initializeGame(mode);
    };

    const initializeGame = (mode) => {
        const emojis = ['🌞', '🌈', '🍕', '🚀', '🐶', '⚽', '🎉', '🎸', 
                       '🌺', '🦋', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠'];
        const gameEmojis = emojis.slice(0, mode / 2);
        const cards = [...gameEmojis, ...gameEmojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                value: emoji,
                isFlipped: false,
                isMatched: false
            }));

        dispatch({ type: 'START_GAME', cards });
    };

    return React.createElement('div', {
        style: {
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            margin: '20px'
        }
    },
        React.createElement('h2', null, 'Settings'),
        React.createElement('div', {
            style: { marginBottom: '20px' }
        },
            React.createElement('h3', null, 'Game Mode'),
            React.createElement('div', {
                style: { display: 'flex', gap: '10px' }
            },
                gameModes.map(mode => 
                    React.createElement('button', {
                        key: mode.value,
                        onClick: () => handleModeChange(mode.value),
                        style: {
                            padding: '10px',
                            backgroundColor: gameMode === mode.value ? '#4CAF50' : '#ddd',
                            border: 'none',
                            borderRadius: '5px',
                            color: gameMode === mode.value ? 'white' : 'black',
                            cursor: 'pointer'
                        }
                    }, mode.name)
                )
            )
        ),
        React.createElement('div', null,
            React.createElement('h3', null, 'Background'),
            React.createElement('div', {
                style: { display: 'flex', gap: '10px' }
            },
                backgrounds.map(bg => 
                    React.createElement('button', {
                        key: bg.id,
                        onClick: () => dispatch({ type: 'CHANGE_BACKGROUND', background: bg.id }),
                        style: {
                            padding: '10px',
                            backgroundColor: background === bg.id ? '#4CAF50' : '#ddd',
                            border: 'none',
                            borderRadius: '5px',
                            color: background === bg.id ? 'white' : 'black',
                            cursor: 'pointer'
                        }
                    }, bg.name)
                )
            )
        )
    );
}

export default Settings;