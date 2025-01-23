import React from 'react';

function Card(props) {
    return React.createElement('button', {
        style: {
            width: 100,
            height: 100,
            margin: 0,
            background: props.isFlipped ? '#ccc' : '#333',
            color: '#000',
            padding: 8,
            borderRadius: 7,
            border: 0,
            cursor: 'pointer',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        onClick: props.onClick
    }, props.isFlipped ? props.value : '');
}

export default Card;