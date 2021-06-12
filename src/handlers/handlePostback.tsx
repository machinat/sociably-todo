import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import TodoController from '../services/TodoController';
import AddingTodo from '../scenes/AddingTodo';
import WithMenu from '../components/WithMenu';
import ShowTodoList from '../components/ShowTodoList';
import { ChatEventContext } from '../types';

const handlePostback = makeContainer({
  deps: [Script.Processor, TodoController] as const,
})(
  (processor, todoController) =>
    async ({
      event,
      reply,
    }: ChatEventContext & {
      event: { type: 'postback' | 'callback_query' };
    }) => {
      const action = JSON.parse(event.data!);

      if (action.type === 'add') {
        const runtime = await processor.start(event.channel!, AddingTodo);
        return reply(runtime.output());
      }

      if (action.type === 'list') {
        const { data } = await todoController.getTodos(event.channel!);
        return reply(
          <ShowTodoList todos={data.todos} offset={action.offset || 0} />
        );
      }

      if (action.type === 'finish') {
        const { todo, data } = await todoController.finishTodo(
          event.channel!,
          action.id
        );
        return reply(
          <WithMenu todoCount={data.todos.length}>
            {todo ? (
              <p>
                Todo "<b>{todo.name}</b>" is done!
              </p>
            ) : (
              <p>This todo is closed.</p>
            )}
          </WithMenu>
        );
      }
    }
);

export default handlePostback;
