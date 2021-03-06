import Sociably, { SociablyNode } from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import * as Telegram from '@sociably/telegram/components';
import * as Line from '@sociably/line/components';

type WithYesNoRepliesProps = {
  children: SociablyNode;
};

const WithYesNoReplies = (
  { children }: WithYesNoRepliesProps,
  { platform }
) => {
  const yesWords = 'Ok';
  const yesData = JSON.stringify({ action: 'yes' });
  const noWords = 'Maybe later';
  const noData = JSON.stringify({ action: 'no' });

  if (platform === 'messenger') {
    return (
      <Messenger.Expression
        quickReplies={
          <>
            <Messenger.TextReply title={yesWords} payload={yesData} />
            <Messenger.TextReply title={noWords} payload={noData} />
          </>
        }
      >
        {children}
      </Messenger.Expression>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={
          <Telegram.ReplyKeyboard oneTimeKeyboard resizeKeyboard>
            <Telegram.TextReply text={yesWords} />
            <Telegram.TextReply text={noWords} />
          </Telegram.ReplyKeyboard>
        }
      >
        {children}
      </Telegram.Expression>
    );
  }

  if (platform === 'line') {
    return (
      <Line.Expression
        quickReplies={
          <>
            <Line.QuickReply>
              <Line.PostbackAction
                displayText={yesWords}
                label={yesWords}
                data={yesData}
              />
            </Line.QuickReply>
            <Line.QuickReply>
              <Line.PostbackAction
                displayText={noWords}
                label={noWords}
                data={noData}
              />
            </Line.QuickReply>
          </>
        }
      >
        {children}
      </Line.Expression>
    );
  }

  return <>{children}</>;
};

export default WithYesNoReplies;
