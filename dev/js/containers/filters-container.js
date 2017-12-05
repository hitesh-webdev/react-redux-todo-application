import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FilterList from '../components/filter-list';
import * as todoActions from '../actions';

class FiltersContainer extends Component {

    constructor(props) {
        super(props);
        this.onFilterClick = this.onFilterClick.bind(this);
        this.onDeleteCompleted = this.onDeleteCompleted.bind(this);
        this.checkActiveTodos = this.checkActiveTodos.bind(this);
    }

    onFilterClick(filter) {
        this.props.actions.setFilter(filter);
    }

    onDeleteCompleted() {
        this.props.actions.deleteCompletedTodos();
    }

    checkActiveTodos() {
       return this.props.todos.some(todo => todo['completed'] === true);
    }

    render() {
        return (
            <FilterList activeStatus={this.checkActiveTodos()} onDeleteCompleted={this.onDeleteCompleted} visibilityFilter={this.props.filter} onFilterClick={this.onFilterClick} />
        );
    }

}

function mapStateToProps(state) {
    return {
        filter: state.filter,
        todos: state.todos
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(todoActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersContainer); 