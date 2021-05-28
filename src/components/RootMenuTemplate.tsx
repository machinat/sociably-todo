import Machinat, { MachinatNode } from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { ServerDomain, LineLiffId } from '../interface';

type RootMenuTemplateProps = {
  children: MachinatNode;
};

const RootMenuTemplate = makeContainer({ deps: [ServerDomain, LineLiffId] })(
  (serverDomain, lineLiffId) =>
    ({ children }: RootMenuTemplateProps, { platform }) => {
      const listLabel = 'Show Todos 📑';
      const listData = JSON.stringify({ action: 'list' });

      const addLabel = 'New Todo ➕';
      const addData = JSON.stringify({ action: 'add' });

      const editLabel = 'Edit 📤';

      if (platform === 'messenger') {
        return (
          <Messenger.ButtonTemplate
            buttons={
              <>
                <Messenger.PostbackButton
                  title={listLabel}
                  payload={listData}
                />
                <Messenger.PostbackButton title={addLabel} payload={addData} />
                <Messenger.UrlButton
                  messengerExtensions
                  title={editLabel}
                  url={`https://${serverDomain}/webview?platform=messenger`}
                />
              </>
            }
          >
            {children}
          </Messenger.ButtonTemplate>
        );
      }

      if (platform === 'telegram') {
        return (
          <Telegram.Text
            replyMarkup={
              <Telegram.InlineKeyboard>
                <Telegram.CallbackButton text={listLabel} data={listData} />
                <Telegram.CallbackButton text={addLabel} data={addData} />
                <Telegram.UrlButton
                  login
                  text={editLabel}
                  url={`https://${serverDomain}/auth/telegram`}
                />
              </Telegram.InlineKeyboard>
            }
          >
            {children}
          </Telegram.Text>
        );
      }

      if (platform === 'line') {
        return (
          <Line.ButtonTemplate
            altText={(template) => template.text}
            actions={
              <>
                <Line.PostbackAction label={listLabel} data={listData} />
                <Line.PostbackAction label={addLabel} data={addData} />
                <Line.UriAction
                  label={editLabel}
                  uri={`https://liff.line.me/${lineLiffId}`}
                />
              </>
            }
          >
            {children}
          </Line.ButtonTemplate>
        );
      }

      return <>{children}</>;
    }
);

export default RootMenuTemplate;
