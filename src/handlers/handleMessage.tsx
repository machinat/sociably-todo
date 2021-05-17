import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { StartRuntime } from '@machinat/script';
import TodoController from '../services/TodoController';
import useProfileFactory from '../services/useProfileFactory';
import AddingTodo from '../scenes/AddingTodo';
import AnswerBasePanel from '../components/AnswerBasePanel';
import { ChatEventContext } from '../types';

const handleMessage = makeContainer({
  deps: [TodoController, useProfileFactory] as const,
})(
  (todoController, getProfile) =>
    async ({
      event,
      reply,
    }: ChatEventContext & { event: { category: 'message' } }) => {
      if (event.type === 'text') {
        const matchingAddTodo = event.text.match(/add\s+(todo)?(.*)/i);
        if (matchingAddTodo) {
          const [, , todoName] = matchingAddTodo;

          if (!todoName) {
            return reply(
              <StartRuntime channel={event.channel} script={AddingTodo} />
            );
          }

          const { state } = await todoController.addTodo(
            event.channel,
            todoName
          );
          return reply(
            <AnswerBasePanel state={state}>
              <p>
                Todo "<b>{todoName}</b>" is added!
              </p>
            </AnswerBasePanel>
          );
        }
      }

      const { state } = await todoController.getTodos(event.channel);
      const profile = await getProfile(event.user!);
      return reply(
        <AnswerBasePanel state={state}>
          <p>Hello, {profile.name}! I'm a Todo Bot 🤖</p>
        </AnswerBasePanel>
      );
    }
);

export default handleMessage;
