import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import TodoController from '../services/TodoController';
import useProfileFactory from '../services/useProfileFactory';
import AddingTodo from '../scenes/AddingTodo';
import AskingFirstTodo from '../scenes/AskingFirstTodo';
import WithMenu from '../components/WithMenu';
import { ChatEventContext } from '../types';

const handleMessage = makeContainer({
  deps: [Script.Processor, TodoController, useProfileFactory] as const,
})(
  (processor, todoController, getProfile) =>
    async ({
      event,
      reply,
    }: ChatEventContext & { event: { category: 'message' } }) => {
      if (event.type === 'text') {
        const matchingAddTodo = event.text.match(/add(\s+todo)?(.*)/i);
        if (matchingAddTodo) {
          const todoName = matchingAddTodo[2].trim();

          if (!todoName) {
            const runtime = await processor.start(event.channel, AddingTodo);
            return reply(runtime.output());
          }

          const { data } = await todoController.addTodo(
            event.channel,
            todoName
          );
          return reply(
            <WithMenu todoCount={data.todos.length}>
              <p>
                Todo "<b>{todoName}</b>" is added!
              </p>
            </WithMenu>
          );
        }
      }

      const { data } = await todoController.getTodos(event.channel);
      const profile = await getProfile(event.user!);
      const helloWords = <p>Hello, {profile.name}! I'm a Todo Bot 🤖</p>;

      if (data.todos.length === 0) {
        const runtime = await processor.start(event.channel, AskingFirstTodo);
        return reply(
          <>
            {helloWords}
            {runtime.output()}
          </>
        );
      }

      return reply(
        <WithMenu todoCount={data.todos.length}>{helloWords}</WithMenu>
      );
    }
);

export default handleMessage;
