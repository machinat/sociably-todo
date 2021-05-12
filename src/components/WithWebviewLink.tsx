import Machinat, { MachinatNode, FunctionalComponent } from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { ServerDomain, LineLiffId } from '../interface';

type WithWebviewLinkProps = {
  children: MachinatNode;
};

export default makeContainer({
  deps: [
    ServerDomain,
    LineLiffId,
  ],
})(function WithWebviewLink(
  domain,
  lineLiffId
): FunctionalComponent<WithWebviewLinkProps> {
  return ({ children }, { platform }) => {

    if (platform === 'messenger') {
      return (
        <Messenger.ButtonTemplate
          buttons={
            <Messenger.UrlButton
              title="Open Webview ↗️"
              url={`https://${domain}/webview?platform=messenger`}
              messengerExtensions
            />
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
              <Telegram.UrlButton
                login
                text="Open Webview ↗️"
                url={`https://${domain}/auth/telegram`}
              />
            </Telegram.InlineKeyboard>
          }
        >
          {children}
        </Telegram.Text>
      );
    }

    if (platform === 'line') {
      const liffLink = `https://liff.line.me/${lineLiffId}`;
      return (
        <Line.ButtonTemplate
          defaultAction={<Line.UriAction uri={liffLink} />}
          altText={liffLink}
          actions={<Line.UriAction label="Open Webview ↗️" uri={liffLink} />}
        >
          {children}
        </Line.ButtonTemplate>
      );
    }

    return (
      <p>
        {children}
        <br />
        https://{domain}/webview
      </p>
    );
  };
});
