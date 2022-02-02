import Machinat, { makeContainer } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { ServerDomain, LineLiffId } from '../interface';

const WithMenu = makeContainer({ deps: [ServerDomain, LineLiffId] })(
  (serverDomain, lineLiffId) =>
    (_, { platform }) => {
      const msg = <>Edit your todos here 👇</>;

      const editLabel = 'Edit 📤';

      if (platform === 'messenger') {
        return (
          <Messenger.ButtonTemplate
            buttons={
              <Messenger.UrlButton
                messengerExtensions
                title={editLabel}
                url={`https://${serverDomain}/webview?platform=messenger`}
              />
            }
          >
            {msg}
          </Messenger.ButtonTemplate>
        );
      }

      if (platform === 'telegram') {
        return (
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
            {msg}
          </Telegram.Text>
        );
      }

      if (platform === 'line') {
        return (
          <Line.ButtonTemplate
            altText={(template) => template.text}
            actions={
              <Line.UriAction
                label={editLabel}
                uri={`https://liff.line.me/${lineLiffId}`}
              />
            }
          >
            {msg}
          </Line.ButtonTemplate>
        );
      }

      return <p>{msg}</p>;
    }
);

export default WithMenu;
