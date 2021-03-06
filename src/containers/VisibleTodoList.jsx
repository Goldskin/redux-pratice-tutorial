import { connect } from 'react-redux'
import * as actions from '../actions'
import { VisibilityFilters } from '../const'
import TodoList from '../components/TodoList'
import { withRouter } from 'react-router-dom'
import { getVisibleTodos, getErrorMessage, getIsFetching } from '../reducers'
import React, { Component } from 'react'
import Loading from '../components/Loading';
import FetchError from '../components/FetchError';


class VisibleTodoList extends Component {
    componentDidMount () {
        this.fetchData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            this.fetchData()
        }
    }

    fetchData () {
        const { filter, fetchTodos } = this.props
        fetchTodos(filter)
    }

    render () {
        const { toggleTodo, isFetching, errorMessage, todos } = this.props
        if (isFetching && !todos.length) {
            return (
                <Loading />
            )
        }

        if (errorMessage && !todos.length) {
            return (
                <FetchError
                    message={errorMessage}
                    onRetry={() => this.fetchData()}
                />
            )
        }
        return (
            <TodoList 
                todos={todos}
                onTodoClick={toggleTodo}
            />
        )
    }
}

const mapStateToProps = (state, { match }) => {
    const filter = match.params.filter || VisibilityFilters.SHOW_ALL
    
    return {
        errorMessage: getErrorMessage(state, filter),
        todos: getVisibleTodos(state, filter),
        isFetching: getIsFetching(state, filter),
        filter
    }
}

VisibleTodoList = withRouter(connect(
    mapStateToProps,
    actions
)(VisibleTodoList))

export default VisibleTodoList