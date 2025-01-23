import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';
import History from './components/History';

function App() {
    const [currentView, setCurrentView] = React.useState('game');
    const background = store.getState().background;

    return React.createElement(Provider, { store },
        React.createElement('div', {
            style: {
                minHeight: '100vh',
                background: background === 'orange-purple' 
                    ? 'linear-gradient(45deg, #FF8C00, #800080)'
                    : background === 'blue-green'
                    ? 'linear-gradient(45deg, #0077BE, #00FF7F)'
                    : 'linear-gradient(45deg, #FFB6C1, #FFD700)'
            }
        },
            React.createElement('nav', {
                style: {
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px'
                }
            },
                ['game', 'settings', 'history'].map(view =>
                    React.createElement('button', {
                        key: view,
                        onClick: () => setCurrentView(view),
                        style: {
                            padding: '10px 20px',
                            backgroundColor: currentView === view ? '#4CAF50' : '#ddd',
                            border: 'none',
                            borderRadius: '5px',
                            color: currentView === view ? 'white' : 'black',
                            cursor: 'pointer'
                        }
                    }, view.charAt(0).toUpperCase() + view.slice(1))
                )
            ),
            React.createElement('main', null,
                currentView === 'game' && React.createElement(GameBoard),
                currentView === 'settings' && React.createElement(Settings),
                currentView === 'history' && React.createElement(History)
            )
        )
    );
}

export default App;