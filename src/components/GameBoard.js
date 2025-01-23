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
        const emojis = ['🍎', '🍔', '🍣', '🚗', '🐱', '🏀', '🎂', '🎷', 
            '🌲', '🦁', '🎮', '🎬', '🎯', '🎳', '🎻', '🎾'];
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

    function stopTimer() {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
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
            } else {
                setTimeout(() => {
                    dispatch({ type: 'RESET_CARDS', indices: [...selectedCards, index] });
                    setSelectedCards([]);
                }, 1000);
            }
        }
    }

    React.useEffect(() => {
        // Whenever cards update, check if they're all matched
        if (isPlaying && cards.length > 0 && cards.every(card => card.isMatched)) {
            setIsPlaying(false);
            stopTimer();
            const gameResult = {
                moves,
                time,
                date: new Date().toISOString(),
                mode: gameMode
            };
            dispatch({ type: 'ADD_TO_HISTORY', result: gameResult });
            saveToLocalStorage(gameResult);
        }
    }, [cards, isPlaying, moves, time, gameMode, dispatch]);

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

    const getGridTemplateColumns = () => {
        switch (gameMode) {
            case 4:
                return 'repeat(2, 1fr)';
            case 16:
                return 'repeat(4, 1fr)';
            case 64:
                return 'repeat(8, 1fr)';
            default:
                return 'repeat(4, 1fr)';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={initializeGame}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Start
                </button>
                <span style={{ margin: '0 20px' }}>Moves: {moves}</span>
                <span>Time: {time}s</span>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: getGridTemplateColumns(),
                    gap: '10px',
                    maxWidth: '600px'
                }}
            >
                {cards.map((card, index) => (
                    <Card
                        key={card.id}
                        value={card.value}
                        isFlipped={card.isFlipped || card.isMatched}
                        onClick={() => handleCardClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default GameBoard;