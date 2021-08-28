import Machinat from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { Todo } from '../../types';
import TodoListTemplate from './TodoListTemplate';
import WithMenu from './WithMenu';

type ShowTodoListProps = {
  offset: number;
  todos: Todo[];
};

const ShowTodoList = (
  { offset = 0, todos }: ShowTodoListProps,
  { platform }
) => {
  if (todos.length === 0) {
    return <WithMenu todoCount={todos.length}>{null}</WithMenu>;
  }

  const summaryMsg =
    offset === 0 ? <p>You have {todos.length} todos:</p> : null;

  if (todos.length <= 10) {
    return (
      <>
        {summaryMsg}
        <TodoListTemplate todos={todos} />
      </>
    );
  }

  const end = Math.min(todos.length, offset + 10);
  const rangeMessage = `${offset + 1}-${end} are listed.`;

  const nextLabel = 'Next 10 ⏩';
  const nextData = JSON.stringify({ type: 'list', offset: end });

  return (
    <>
      {summaryMsg}
      <TodoListTemplate todos={todos.slice(offset, end)} />

      {end >= todos.length ? (
        <p>{rangeMessage}</p>
      ) : platform === 'messenger' ? (
        <Messenger.ButtonTemplate
          buttons={
            <Messenger.PostbackButton title={nextLabel} payload={nextData} />
          }
        >
          {rangeMessage}
        </Messenger.ButtonTemplate>
      ) : platform === 'telegram' ? (
        <Telegram.Text
          replyMarkup={
            <Telegram.InlineKeyboard>
              <Telegram.CallbackButton text={nextLabel} data={nextData} />
            </Telegram.InlineKeyboard>
          }
        >
          {rangeMessage}
        </Telegram.Text>
      ) : platform === 'line' ? (
        <Line.ButtonTemplate
          altText={(template) => template.text}
          actions={<Line.PostbackAction label={nextLabel} data={nextData} />}
        >
          {rangeMessage}
        </Line.ButtonTemplate>
      ) : (
        <p>{rangeMessage}</p>
      )}
    </>
  );
};

export default ShowTodoList;
