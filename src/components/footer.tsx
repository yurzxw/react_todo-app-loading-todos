import { Todo } from '../types/Todo';
import classNames from 'classnames';
import * as todosService from '../api/todos';

type Props = {
  onFilter: (filter: string) => void;
  onError: () => void;
  onTodos: () => void;
  todos: Todo[];
  filter: string;
};

export const Footer: React.FC<Props> = ({
  onFilter,
  onError,
  onTodos,
  todos,
  filter,
}) => {
  return (
    <footer
      className={classNames('todoapp__footer', { hidden: todos.length === 0 })}
      data-cy="Footer"
      style={{ display: todos.length === 0 ? 'none' : '' }}
    >
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter('completed')}
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
                .catch(() => onError('Unable to delete todo'));
            }
          });
          onTodos(todos.filter(todo => !todo.completed));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
