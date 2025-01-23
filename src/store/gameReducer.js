const initialState = {
    cards: [],
    moves: 0,
    time: 0,
    gameMode: 16,
    background: 'orange-purple',
    history: []
};

function gameReducer(state = initialState, action) {
    switch(action.type) {
        case 'START_GAME':
            return {
                ...state,
                cards: action.cards,
                moves: 0,
                time: 0
            };
        case 'FLIP_CARD':
            return {
                ...state,
                cards: state.cards.map((card, index) => 
                    index === action.index ? {...card, isFlipped: true} : card
                )
            };
        case 'UPDATE_MOVES':
            return {
                ...state,
                moves: state.moves + 1
            };
        case 'UPDATE_TIME':
            return {
                ...state,
                time: action.time
            };
        case 'MATCH_CARDS':
            return {
                ...state,
                cards: state.cards.map((card, index) => 
                    action.indices.includes(index) ? {...card, isMatched: true} : card
                )
            };
        case 'RESET_CARDS':
            return {
                ...state,
                cards: state.cards.map((card, index) => 
                    action.indices.includes(index) ? {...card, isFlipped: false} : card
                )
            };
        case 'CHANGE_MODE':
            return {
                ...state,
                gameMode: action.mode
            };
        case 'CHANGE_BACKGROUND':
            return {
                ...state,
                background: action.background
            };
        case 'ADD_TO_HISTORY':
            return {
                ...state,
                history: [...state.history, action.result]
            };
        default:
            return state;
    }
}

export default gameReducer;