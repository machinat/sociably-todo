import Machinat from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { Todo } from '../../types';

type TodoListTemplateProps = {
  todos: Todo[];
};

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
                payload={JSON.stringify({ type: 'finish', id: todo.id })}
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
                  data={JSON.stringify({ type: 'finish', id: todo.id })}
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
                data={JSON.stringify({ type: 'finish', id: todo.id })}
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
