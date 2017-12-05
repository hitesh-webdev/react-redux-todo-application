import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoList from '../components/todo-list';
import * as todoActions from '../actions';

class VisibleTodos extends Component {

    constructor(props) {
        super(props);
        this.onTodoClick = this.onTodoClick.bind(this);
    }

    onTodoClick(id) {
        this.props.actions.toggleTodo(id);
    }

    render() {
        return (
            <TodoList todos={this.props.todos} onTodoClick={this.onTodoClick}  />
        );
    }

}

function mapStateToProps(state) {
    return {
        todos: getVisibleTodos(state.todos, state.filter)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(todoActions, dispatch)
    };    
}

function getVisibleTodos(todos, filter) {
    switch(filter) {
        case 'SHOW_ALL':
            return [...todos];
            break;
        case 'SHOW_ACTIVE':
            return todos.filter(todo => {
                return todo['completed'] === false;
            });
            break;
        case 'SHOW_COMPLETED':
            return todos.filter(todo => {
                return todo['completed'] === true;
            });
            break;
        default:
            return todos;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisibleTodos);