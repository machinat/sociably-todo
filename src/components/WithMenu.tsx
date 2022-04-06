import Machinat, { MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@machinat/messenger/webview';
import * as Telegram from '@machinat/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@machinat/telegram/webview';
import * as Line from '@machinat/line/components';
import { WebviewAction as LineWebviewAction } from '@machinat/line/webview';

type WithMenuProps = {
  children: MachinatNode;
  todoCount: number;
};

const WithMenu = ({ children, todoCount }: WithMenuProps, { platform }) => {
  const todoState = (
    <>You have {todoCount > 0 ? <b>{todoCount}</b> : 'no'} todos now.</>
  );

  const listLabel = 'Show Todos 📑';
  const listData = JSON.stringify({ action: 'list' });

  const addLabel = 'New Todo ➕';
  const addData = JSON.stringify({ action: 'add' });

  const editLabel = 'Edit 📤';

  if (platform === 'messenger') {
    return (
      <>
        {children}
        <Messenger.ButtonTemplate
          buttons={
            <>
              <Messenger.PostbackButton title={addLabel} payload={addData} />
              <Messenger.PostbackButton title={listLabel} payload={listData} />
              <MessengerWebviewButton title={editLabel} />
            </>
          }
        >
          {todoState}
        </Messenger.ButtonTemplate>
      </>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={
          <Telegram.ReplyKeyboard resizeKeyboard>
            <Telegram.TextReply text={addLabel} />
            <Telegram.TextReply text={listLabel} />
          </Telegram.ReplyKeyboard>
        }
      >
        {children}
        <Telegram.Text
          replyMarkup={
            <Telegram.InlineKeyboard>
              <TelegramWebviewButton text={editLabel} />
            </Telegram.InlineKeyboard>
          }
        >
          {todoState}
        </Telegram.Text>
      </Telegram.Expression>
    );
  }

  if (platform === 'line') {
    return (
      <>
        {children}
        <Line.ButtonTemplate
          altText={(template) => template.text}
          actions={
            <>
              <Line.PostbackAction
                label={addLabel}
                displayText={addLabel}
                data={addData}
              />
              <Line.PostbackAction
                label={listLabel}
                displayText={listLabel}
                data={listData}
              />
              <LineWebviewAction label={editLabel} />
            </>
          }
        >
          {todoState}
        </Line.ButtonTemplate>
      </>
    );
  }

  return (
    <>
      <p>{children}</p>
      <p>{todoState}</p>
    </>
  );
};
export default WithMenu;
