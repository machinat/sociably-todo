import Machinat, { MachinatNode } from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
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
      const listData = JSON.stringify({ type: 'list' });

      const addLabel = 'New Todo ➕';
      const addData = JSON.stringify({ type: 'add' });

      const editLabel = 'Edit 📤';

      if (platform === 'messenger') {
        return (
          <Messenger.Expression>
            {children}
            <Messenger.ButtonTemplate
              buttons={
                <>
                  <Messenger.PostbackButton
                    title={listLabel}
                    payload={listData}
                  />
                  <Messenger.PostbackButton
                    title={addLabel}
                    payload={addData}
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
          </Messenger.Expression>
        );
      }

      if (platform === 'telegram') {
        return (
          <Telegram.Expression
            replyMarkup={
              <Telegram.ReplyKeyboard>
                <Telegram.TextReply text={listLabel} />
                <Telegram.TextReply text={addLabel} />
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
                    label={listLabel}
                    displayText={listLabel}
                    data={listData}
                  />
                  <Line.PostbackAction
                    label={addLabel}
                    displayText={addLabel}
                    data={addData}
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
