import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddTodo from '../components/add-todo';
import * as todoActions from '../actions';

class AddTodoContainer extends Component {

    constructor(props) {
        super(props);
        this.id = 1;
        this.onAddTodo = this.onAddTodo.bind(this);
    }

    onAddTodo(value) {

        const todo = {
            id: this.id,
            value: value,
            completed: false 
        };

        this.props.actions.addTodo(todo);

        this.id++;

    }

    render() {

        return (
            <AddTodo onAddTodo={this.onAddTodo} />
        );

    }

}

function mapStateToProps(state) {
    return {
        todos: state.todos
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(todoActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTodoContainer);