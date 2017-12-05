import React from 'react';

const AddTodo = ({
    onAddTodo
}) => {
    let input;
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onAddTodo(input.value);
            input.value = '';
        }}>
            <input ref={node => {
                input = node
            }} type="text" required />
            <button type="submit">
                Add Todo
            </button>
        </form>
    );
}

export default AddTodo;