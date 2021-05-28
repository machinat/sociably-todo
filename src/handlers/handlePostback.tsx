import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { StartRuntime } from '@machinat/script';
import TodoController from '../services/TodoController';
import AddingTodo from '../scenes/AddingTodo';
import WithRootMenu from '../components/WithRootMenu';
import ShowTodoList from '../components/ShowTodoList';
import { ChatEventContext } from '../types';

const handlePostback = makeContainer({ deps: [TodoController] })(
  (todoController) =>
    async ({
      event,
      reply,
    }: ChatEventContext & {
      event: { type: 'postback' | 'callback_query' };
    }) => {
      const data = JSON.parse(event.data || '{}');

      if (data.action === 'add') {
        return reply(
          <StartRuntime channel={event.channel!} script={AddingTodo} />
        );
      }

      if (data.action === 'list') {
        const { state } = await todoController.getTodos(event.channel!);
        return reply(
          <ShowTodoList
            todos={state.todos.filter((todo) => !todo.finishAt)}
            offset={data.offset || 0}
          />
        );
      }

      if (data.action === 'finish') {
        const { todo, state } = await todoController.finishTodo(
          event.channel!,
          data.id
        );
        return reply(
          <WithRootMenu todoCount={state.todos.length}>
            {todo ? (
              <p>
                Todo "<b>{todo.name}</b>" is done!
              </p>
            ) : (
              <p>This todo is closed.</p>
            )}
          </WithRootMenu>
        );
      }
    }
);

export default handlePostback;
