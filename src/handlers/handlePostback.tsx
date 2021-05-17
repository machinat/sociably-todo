import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { StartRuntime } from '@machinat/script';
import TodoController from '../services/TodoController';
import AddingTodo from '../scenes/AddingTodo';
import AnswerBasePanel from '../components/AnswerBasePanel';
import AnswerTodoList from '../components/AnswerTodoList';
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
          <AnswerTodoList state={state} offset={data.offset || 0} />
        );
      }

      if (data.action === 'finish') {
        const { todo, state } = await todoController.finishTodo(
          event.channel!,
          data.id
        );
        return reply(
          <AnswerBasePanel state={state}>
            {todo ? (
              <p>
                Todo "<b>{todo.name}</b>" is done!
              </p>
            ) : (
              <p>This todo is closed.</p>
            )}
          </AnswerBasePanel>
        );
      }
    }
);

export default handlePostback;
