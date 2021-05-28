import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { $, WHILE, PROMPT, EFFECT } from '@machinat/script/keywords';
import WithRootMenu from '../components/WithRootMenu';
import TodoController from '../services/TodoController';
import { TodoState } from '../types';

type AddTodoVars = {
  id: number;
  todoName: string;
  state: null | TodoState;
};

export default build<AddTodoVars>(
  {
    name: 'AddTodo',
    initVars: () => ({ id: 0, todoName: '', state: null }),
  },
  <$<AddTodoVars>>
    <WHILE<AddTodoVars> condition={({ vars }) => !vars.todoName}>
      {() => <p>Please enter new todo name:</p>}

      <PROMPT<AddTodoVars>
        key="ask-todo"
        set={({ vars }, { event }) => ({
          ...vars,
          todoName: event.type === 'text' ? event.text : '',
        })}
      />
    </WHILE>

    <EFFECT<AddTodoVars>
      set={makeContainer({ deps: [TodoController] })(
        (todoController) =>
          async ({ vars, channel }) => {
            const { todo, state } = await todoController.addTodo(
              channel,
              vars.todoName
            );
            return {
              ...vars,
              id: todo.id,
              state: state,
            };
          }
      )}
    />

    {async ({ vars: { todoName, state } }) => (
      <WithRootMenu todoCount={state!.todos.length}>
        Todo "<b>{todoName}</b>" is added!
      </WithRootMenu>
    )}
  </$>
);
