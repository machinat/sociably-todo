import Machinat, { MachinatNode } from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { ServerDomain, LineLiffId } from '../interface';

type BaseTemplateProps = {
  children: MachinatNode;
};

const BaseTemplate = makeContainer({ deps: [ServerDomain, LineLiffId] })(
  (serverDomain, lineLiffId) =>
    ({ children }: BaseTemplateProps, { platform }) => {
      const listLabel = 'Show Todos 📑';
      const listData = JSON.stringify({ action: 'list' });

      const addLabel = 'New Todo ➕';
      const addData = JSON.stringify({ action: 'add' });

      const manageLable = 'Edit 📤';

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
                  title={manageLable}
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
                  text={manageLable}
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
                  label={manageLable}
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

export default BaseTemplate;
