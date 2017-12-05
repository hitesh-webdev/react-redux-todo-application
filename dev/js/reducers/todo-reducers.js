export default function (state = [], action) {

    switch(action.type) {

        case "ADD_TODO":
            return [...state, action.payload];
            break;

        case "TOGGLE_TODO":
            const id = action.payload;
            return state.map(todo => {
                if(todo['id'] === id) {
                    todo['completed'] = !todo['completed'];
                }
                return todo;
            })
            break;

        case "DELETE_COMPLETED":
            return state.filter(todo => {
                return todo['completed'] === false;
            });
            break;

        default: 
            return state;

    }

}