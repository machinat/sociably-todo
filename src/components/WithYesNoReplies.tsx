import Machinat, { MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';

type WithYesNoRepliesProps = {
  children: MachinatNode;
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
            <Line.QuickReply
              action={
                <Line.PostbackAction displayText={yesWords} data={yesData} />
              }
            />
            <Line.QuickReply
              action={
                <Line.PostbackAction displayText={noWords} data={noData} />
              }
            />
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
