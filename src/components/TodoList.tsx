import Machinat from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { Todo } from '../types';

type TodoListTemplateProps = {
  todos: Todo[];
};

const finishTodoData = (todo: Todo) =>
  JSON.stringify({ action: 'finish', id: todo.id });

const TodoListTemplate = ({ todos }: TodoListTemplateProps, { platform }) => {
  const finishLabel = 'Done ✓';

  if (platform === 'messenger') {
    return (
      <Messenger.GenericTemplate>
        {todos.map((todo) => (
          <Messenger.GenericItem
            title={todo.name}
            buttons={
              <Messenger.PostbackButton
                title={finishLabel}
                payload={finishTodoData(todo)}
              />
            }
          />
        ))}
      </Messenger.GenericTemplate>
    );
  }

  if (platform === 'telegram') {
    return (
      <>
        {todos.map((todo) => (
          <Telegram.Text
            replyMarkup={
              <Telegram.InlineKeyboard>
                <Telegram.CallbackButton
                  text={finishLabel}
                  data={finishTodoData(todo)}
                />
              </Telegram.InlineKeyboard>
            }
          >
            {todo.name}
          </Telegram.Text>
        ))}
      </>
    );
  }

  if (platform === 'line') {
    return (
      <Line.CarouselTemplate
        altText={todos.map((todo) => todo.name).join('\n')}
      >
        {todos.map((todo) => (
          <Line.CarouselItem
            actions={
              <Line.PostbackAction
                label={finishLabel}
                displayText={`Finish ${todo.name}`}
                data={finishTodoData(todo)}
              />
            }
          >
            {todo.name}
          </Line.CarouselItem>
        ))}
      </Line.CarouselTemplate>
    );
  }

  return <>{todos.map((todo) => todo.name).join('\n')}</>;
};

export default TodoListTemplate;
