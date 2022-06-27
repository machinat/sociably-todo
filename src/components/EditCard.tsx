import Sociably from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@sociably/messenger/webview';
import * as Telegram from '@sociably/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@sociably/telegram/webview';
import * as Line from '@sociably/line/components';
import { WebviewAction as LineWebviewAction } from '@sociably/line/webview';

const WithMenu = (_, { platform }) => {
  const msg = <>Edit your todos here 👇</>;

  const editLabel = 'Edit 📤';

  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={<MessengerWebviewButton title={editLabel} />}
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
            <TelegramWebviewButton text={editLabel} />
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
        actions={<LineWebviewAction label={editLabel} />}
      >
        {msg}
      </Line.ButtonTemplate>
    );
  }

  return <p>{msg}</p>;
};
export default WithMenu;
