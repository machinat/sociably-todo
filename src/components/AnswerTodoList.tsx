import Machinat from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { TodoState } from '../types';
import TodoListTemplate from './TodoListTemplate';
import AnswerBasePanel from './AnswerBasePanel';

type AnswerTodoListProps = {
  offset: number;
  state: TodoState;
};

const AnswerTodoList = (
  { offset = 0, state }: AnswerTodoListProps,
  { platform }
) => {
  if (state.todos.length === 0) {
    return (
      <AnswerBasePanel state={state}>You have no todos now.</AnswerBasePanel>
    );
  }

  const summaryMsg =
    offset === 0 ? <p>You have {state.todos.length} todos:</p> : null;

  if (state.todos.length <= 10) {
    return (
      <>
        {summaryMsg}
        <TodoListTemplate todos={state.todos} />
      </>
    );
  }

  const end = Math.min(state.todos.length, offset + 10);
  const rangeMessage = `${offset + 1}-${end} are listed.`;

  const nextLabel = 'Next 10 ⏩';
  const nextData = JSON.stringify({ action: 'list', offset: end });

  return (
    <>
      {summaryMsg}
      <TodoListTemplate todos={state.todos.slice(offset, end)} />

      {end >= state.todos.length ? (
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

export default AnswerTodoList;
