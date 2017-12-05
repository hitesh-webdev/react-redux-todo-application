import {combineReducers} from 'redux';
import TodoReducer from './todo-reducers';
import FilterReducer from './filter-reducers';

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
    todos: TodoReducer,
    filter: FilterReducer
});

export default allReducers;
