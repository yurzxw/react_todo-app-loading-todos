import React from 'react';
import { USER_ID } from '../api/todos';
import * as todosService from '../api/todos';

type Props = {
  onError: () => void;
  onTodos: () => void;
  onQuery: () => void;
  query: string;
};
export const Header: React.FC<Props> = ({
  onError,
  onTodos,
  onQuery,
  query,
}) => {
  return (
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
            onError('Title should not be empty');

            return;
          }

          todosService
            .postTodo({
              userId: USER_ID,
              title: query,
              completed: false,
            })
            .then(newTodo => {
              onTodos(currentTodos => [...currentTodos, newTodo]);
            })
            .catch(() => onError('Unable to add a todo'));

          onQuery('');
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQuery(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
