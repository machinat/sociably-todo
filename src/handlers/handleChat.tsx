import Machinat, { makeContainer } from '@machinat/core';
import TodoController from '../services/TodoController';
import useIntent from '../services/useIntent';
import useUserProfile from '../services/useUserProfile';
import AddingTodo from '../scenes/AddingTodo';
import AskingFirstTodo from '../scenes/AskingFirstTodo';
import ShowTodos from '../components/ShowTodos';
import EditCard from '../components/EditCard';
import WithMenu from '../components/WithMenu';
import { ChatEventContext } from '../types';

const handleMessage = makeContainer({
  deps: [TodoController, useIntent, useUserProfile],
})(
  (todoController, getIntent, getUserProfile) =>
    async (
      ctx: ChatEventContext & { event: { category: 'message' | 'postback' } }
    ) => {
      const { event, reply } = ctx;
      if (!event.channel) {
        return;
      }

      const intent = await getIntent(event);

      if (intent.type === 'add') {
        return reply(<AddingTodo.Start />);
      }
      if (intent.type === 'edit') {
        return reply(<EditCard />);
      }
      if (intent.type === 'list') {
        const { data } = await todoController.getTodos(event.channel);
        return reply(<ShowTodos todos={data.todos} offset={0} />);
      }
      if (intent.type === 'finish') {
        const { todo, data } = await todoController.finishTodo(
          event.channel,
          intent.payload.id
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

      const { data } = await todoController.getTodos(event.channel);
      const profile = await getUserProfile(event.user);
      const helloWords = (
        <p>Hello{profile ? `, ${profile.name}` : ''}! I'm a Todo Bot 🤖</p>
      );

      if (data.todos.length === 0) {
        return reply(
          <>
            {helloWords}
            <AskingFirstTodo.Start />
          </>
        );
      }

      return reply(
        <WithMenu todoCount={data.todos.length}>{helloWords}</WithMenu>
      );
    }
);

export default handleMessage;
