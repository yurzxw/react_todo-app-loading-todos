/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { USER_ID } from './api/todos';
import * as todosService from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [id, setId] = useState(0);

  if (error !== '') {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  function handleToggle(todoId: number) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === todoId) {
          todosService
            .patchTodo(todo.id, { completed: !todo.completed })
            .catch(() => setError('Unable to update a todo'));
          setId(todo.id);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 400);

          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(todoId) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== todoId);
    });

    todosService
      .deleteTodo(todoId)
      .catch(() => setError('Unable to delete a todo'));
  }

  useEffect(() => {
    //todosService.clearTodos();
    setLoading(true);
    todosService
      .getTodos()
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          setTodos([]);
        }
      })
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return todo;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              event.preventDefault();
              if (query === '') {
                setError('Title should not be empty');

                return;
              }

              todosService
                .postTodo({
                  userId: USER_ID,
                  title: query,
                  completed: false,
                })
                .then(newTodo => {
                  setTodos(currentTodos => [...currentTodos, newTodo]);
                })
                .catch(() => setError('Unable to add a todo'));

              setQuery('');
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              key={todo.id}
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed ? true : false}
                  onChange={() => {
                    handleToggle(todo.id);
                  }}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deleteTodo(todo.id);
                }}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal', 'overlay', {
                  'is-active': loading && id === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {filteredTodos.length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filter === 'all',
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilter('all')}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filter === 'active',
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilter('active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filter === 'completed',
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilter('completed')}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={() => {
              todos.map(todo => {
                if (todo.completed) {
                  todosService
                    .deleteTodo(todo.id)
                    .catch(() => setError('Unable to delete todo'));
                }
              });
              setTodos(todos.filter(todo => !todo.completed));
            }}
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};

{
  /* This form is shown instead of the title and remove button */
}

{
  /* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </form> */
}

{
  /* 'is-active' class puts this modal on top of the todo */
}

{
  /* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div> */
}
