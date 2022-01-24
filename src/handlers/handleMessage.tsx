import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import IntentRecognizer from '@machinat/core/base/IntentRecognizer';
import Script from '@machinat/script';
import TodoController from '../services/TodoController';
import useUserProfile from '../services/useUserProfile';
import AddingTodo from '../scenes/AddingTodo';
import AskingFirstTodo from '../scenes/AskingFirstTodo';
import ShowTodos from '../components/ShowTodos';
import EditCard from '../components/EditCard';
import WithMenu from '../components/WithMenu';
import recognitionData from '../recognitionData';
import { ChatEventContext } from '../types';

const handleMessage = makeContainer({
  deps: [Script.Processor, IntentRecognizer, TodoController, useUserProfile],
})(
  (
      processor,
      intentRecognizer: IntentRecognizer<typeof recognitionData>,
      todoController,
      getProfile
    ) =>
    async (ctx: ChatEventContext & { event: { category: 'message' } }) => {
      const { event, reply } = ctx;

      if (event.type === 'text') {
        const intent = await intentRecognizer.detectText(
          event.channel,
          event.text
        );

        if (intent.type === 'addTodo') {
          const runtime = await processor.start(event.channel, AddingTodo);
          return reply(runtime.output());
        }
        if (intent.type === 'editTodos') {
          return reply(<EditCard />);
        }
        if (intent.type === 'listTodos') {
          const { data } = await todoController.getTodos(event.channel);
          return reply(<ShowTodos todos={data.todos} offset={0} />);
        }
      }

      const { data } = await todoController.getTodos(event.channel);
      const profile = await getProfile(event.user!);
      const helloWords = (
        <p>Hello{profile ? `, ${profile.name}` : ''}! I'm a Todo Bot 🤖</p>
      );

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
