import Machinat from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@machinat/messenger/webview';
import * as Telegram from '@machinat/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@machinat/telegram/webview';
import * as Line from '@machinat/line/components';
import { WebviewAction as LineWebviewAction } from '@machinat/line/webview';

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
