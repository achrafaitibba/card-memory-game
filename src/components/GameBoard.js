import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from './Card';

function GameBoard() {
    const dispatch = useDispatch();
    const { cards, moves, time, gameMode } = useSelector(state => state);
    const [selectedCards, setSelectedCards] = React.useState([]);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const timerRef = React.useRef(null);

    function initializeGame() {
        const emojis = ['🌞', '🌈', '🍕', '🚀', '🐶', '⚽', '🎉', '🎸', 
                       '🌺', '🦋', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠'];
        const gameEmojis = emojis.slice(0, gameMode / 2);
        const cards = [...gameEmojis, ...gameEmojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                value: emoji,
                isFlipped: false,
                isMatched: false
            }));

        dispatch({ type: 'START_GAME', cards });
        setIsPlaying(true);
        startTimer();
    }

    function startTimer() {
        if (timerRef.current) clearInterval(timerRef.current);
        let seconds = 0;
        timerRef.current = setInterval(() => {
            seconds += 1;
            dispatch({ type: 'UPDATE_TIME', time: seconds });
        }, 1000);
    }

    function handleCardClick(index) {
        if (!isPlaying) return;
        if (selectedCards.length === 2) return;
        if (cards[index].isMatched) return;
        if (selectedCards.includes(index)) return;

        dispatch({ type: 'FLIP_CARD', index });
        setSelectedCards([...selectedCards, index]);

        if (selectedCards.length === 1) {
            dispatch({ type: 'UPDATE_MOVES' });
            if (cards[selectedCards[0]].value === cards[index].value) {
                dispatch({ type: 'MATCH_CARDS', indices: [...selectedCards, index] });
                setSelectedCards([]);
                checkGameEnd();
            } else {
                setTimeout(() => {
                    dispatch({ type: 'RESET_CARDS', indices: [...selectedCards, index] });
                    setSelectedCards([]);
                }, 1000);
            }
        }
    }

    function checkGameEnd() {
        if (cards.every(card => card.isMatched)) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            const gameResult = {
                moves,
                time,
                date: new Date().toISOString(),
                mode: gameMode
            };
            dispatch({ type: 'ADD_TO_HISTORY', result: gameResult });
            saveToLocalStorage(gameResult);
        }
    }

    function saveToLocalStorage(result) {
        const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        history.push(result);
        localStorage.setItem('gameHistory', JSON.stringify(history));
    }

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return React.createElement('div', { 
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
        }
    },
        React.createElement('div', { 
            style: {
                marginBottom: '20px'
            }
        },
            React.createElement('button', {
                onClick: initializeGame,
                style: {
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer'
                }
            }, 'Start'),
            React.createElement('span', {
                style: {
                    margin: '0 20px'
                }
            }, `Moves: ${moves}`),
            React.createElement('span', null, `Time: ${time}s`)
        ),
        React.createElement('div', {
            style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.sqrt(gameMode)}, 1fr)`,
                gap: '10px',
                maxWidth: '600px'
            }
        },
            cards.map((card, index) => 
                React.createElement(Card, {
                    key: card.id,
                    value: card.value,
                    isFlipped: card.isFlipped || card.isMatched,
                    onClick: () => handleCardClick(index)
                })
            )
        )
    );
    
}

export default GameBoard;