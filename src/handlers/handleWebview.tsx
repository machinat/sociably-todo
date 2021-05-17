import { makeContainer } from '@machinat/core/service';
import TodoController from '../services/TodoController';
import type { WebAppEventContext } from '../types';

const handleWebview = makeContainer({ deps: [TodoController] })(
  (todoController) =>
    async ({ event, bot, metadata: { auth } }: WebAppEventContext) => {
      if (event.type === 'connect') {
        const { state } = await todoController.getTodos(auth.channel);

        return bot.send(event.channel, {
          category: 'push',
          type: 'todo_data',
          payload: { state },
        });
      }

      if (event.type === 'delete_todo') {
        const { todo } = await todoController.deleteTodo(
          auth.channel,
          event.payload.id
        );

        if (todo) {
          await bot.send(event.channel, {
            category: 'push',
            type: 'todo_deleted',
            payload: { todo },
          });
        }
        return;
      }
    }
);

export default handleWebview;
