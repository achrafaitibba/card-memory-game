import React from 'react';

function History() {
    const [history, setHistory] = React.useState([]);

    React.useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        setHistory(savedHistory);
    }, []);

    return React.createElement('div', {
        style: {
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            margin: '20px'
        }
    },
        React.createElement('h2', null, 'Game History'),
        React.createElement('div', {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }
        },
            history.length === 0 
                ? React.createElement('p', null, 'No games played yet')
                : history.map((game, index) =>
                    React.createElement('div', {
                        key: index,
                        style: {
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    },
                        React.createElement('p', null, `Date: ${new Date(game.date).toLocaleDateString()}`),
                        React.createElement('p', null, `Mode: ${game.mode} cards`),
                        React.createElement('p', null, `Moves: ${game.moves}`),
                        React.createElement('p', null, `Time: ${game.time} seconds`)
                    )
                )
        )
    );
}

export default History;