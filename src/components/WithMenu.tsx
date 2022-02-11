import Machinat, { makeContainer, MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { ServerDomain, LineLiffId } from '../interface';

type WithMenuProps = {
  children: MachinatNode;
  todoCount: number;
};

const WithMenu = makeContainer({ deps: [ServerDomain, LineLiffId] })(
  (serverDomain, lineLiffId) =>
    ({ children, todoCount }: WithMenuProps, { platform }) => {
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
                  <Messenger.PostbackButton
                  title={addLabel}
                  payload={addData}
                  />
                  <Messenger.PostbackButton
                    title={listLabel}
                    payload={listData}
                  />
                  <Messenger.UrlButton
                    messengerExtensions
                    title={editLabel}
                    url={`https://${serverDomain}/webview?platform=messenger`}
                  />
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
                  <Telegram.UrlButton
                    login
                    text={editLabel}
                    url={`https://${serverDomain}/auth/telegram`}
                  />
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
                  <Line.UriAction
                    label={editLabel}
                    uri={`https://liff.line.me/${lineLiffId}`}
                  />
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
    }
);

export default WithMenu;
