import React from 'react';

const Todo = ({
    onClick,
    completed,
    value
}) => {
    return (
        <li
        style={{cursor: 'pointer'}}
        onClick={onClick}
        style={{textDecoration: completed ? "line-through" : "none"}}>
            {value}
        </li>
    );
};

export default Todo;