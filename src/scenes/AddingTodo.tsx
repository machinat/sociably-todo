import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import * as $ from '@machinat/script/keywords';
import WithMenu from '../components/WithMenu';
import TodoController from '../services/TodoController';

type AddingTodoVars = {
  todoName: string;
  todosCount: number;
};

export default build<AddingTodoVars>(
  {
    name: 'AddingTodo',
    initVars: () => ({ todoName: '', todosCount: 0 }),
  },
  <$.BLOCK<AddingTodoVars>>
    <$.WHILE<AddingTodoVars> condition={({ vars }) => !vars.todoName}>
      {() => <p>Please enter new todo name:</p>}

      <$.PROMPT<AddingTodoVars>
        key="ask-todo"
        set={({ vars }, { event }) => ({
          ...vars,
          todoName: event.type === 'text' ? event.text : '',
        })}
      />
    </$.WHILE>

    <$.EFFECT<AddingTodoVars>
      set={makeContainer({ deps: [TodoController] })(
        (todoController) =>
          async ({ vars, channel }) => {
            const { data } = await todoController.addTodo(
              channel,
              vars.todoName
            );
            return {
              ...vars,
              todosCount: data.todos.length,
            };
          }
      )}
    />

    {({ vars: { todoName, todosCount } }) => (
      <WithMenu todoCount={todosCount}>
        Todo "<b>{todoName}</b>" is added!
      </WithMenu>
    )}
  </$.BLOCK>
);
