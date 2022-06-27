import { makeContainer } from '@sociably/core';
import TodoController from '../services/TodoController';
import type { WebAppEventContext } from '../types';

const handleWebview = makeContainer({ deps: [TodoController] })(
  (todoController) =>
    async ({ event, bot, metadata: { auth } }: WebAppEventContext) => {
      if (event.type === 'connect') {
        const { data } = await todoController.getTodos(auth.channel);

        return bot.send(event.channel, {
          category: 'webview_push',
          type: 'app_data',
          payload: { data },
        });
      }

      if (event.type === 'delete_todo') {
        const { todo } = await todoController.deleteTodo(
          auth.channel,
          event.payload.id
        );

        if (todo) {
          return bot.send(event.channel, {
            category: 'webview_push',
            type: 'todo_deleted',
            payload: { todo },
          });
        }
      }

      if (event.type === 'update_todo') {
        const { id, name } = event.payload;
        const { todo } = await todoController.updateTodo(
          auth.channel,
          id,
          name
        );

        if (todo) {
          return bot.send(event.channel, {
            category: 'webview_push',
            type: 'todo_updated',
            payload: { todo },
          });
        }
      }
    }
);

export default handleWebview;
