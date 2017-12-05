import React from 'react';
import AddTodoContainer from '../containers/add-todo-container';
import VisibleTodos from '../containers/visible-todos';
import FiltersContainer from '../containers/filters-container';
require('../../scss/style.scss');

const App = () => (
    <div>
        <AddTodoContainer />
        <VisibleTodos />
        <FiltersContainer />
    </div>
);

export default App;
