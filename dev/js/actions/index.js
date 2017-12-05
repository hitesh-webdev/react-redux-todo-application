export const addTodo = (todo) => {
    console.log("You added a Todo: ", todo);
    return {
        type: 'ADD_TODO',
        payload: todo
    };
};

export const toggleTodo = (id) => {
    console.log("You toggled a Todo");
    return {
        type: 'TOGGLE_TODO',
        payload: id
    };
}

export const setFilter = (filter) => {
    console.log("You changed the visibility to: " + filter);
    return {
        type: filter
    };
}

export const deleteCompletedTodos = () => {
    console.log('You deleted all the completed Todos');
    return {
        type: 'DELETE_COMPLETED'
    };
}