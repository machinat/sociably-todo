import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { Stream } from '@machinat/stream';
import { filter } from '@machinat/stream/operators';
import WithWebviewLink from './components/WithWebviewLink';
import type {
  AppEventContext,
  ChatEventContext,
  WebAppEventContext,
} from './types';

const main = (event$: Stream<AppEventContext>): void => {
  event$
    .pipe(filter(({ event }) => event.category === 'message'))
    .subscribe(async ({ event, reply }: ChatEventContext) => {
      await reply(
        <WithWebviewLink>
          Hello {event.type === 'text' ? event.text : 'World'}!
        </WithWebviewLink>
      );
    });

  event$
    .pipe(filter(({ event }) => event.platform === 'webview'))
    .subscribe(
      makeContainer({ deps: [Machinat.BaseBot] })(
        (baseBot) => async (context: WebAppEventContext) => {
          const { event, bot: webviewBot, metadata: { auth } } = context;

          if (event.type === 'connect') {
            // send hello when webview connection connect
            await webviewBot.send(event.channel, {
              category: 'greeting',
              type: 'hello',
              payload: `Hello, user from ${auth.platform}!`,
            });
          } else if (event.type === 'hello') {
            // reflect hello to chatroom
            await baseBot.render(
              auth.channel,
              <WithWebviewLink>Hello {event.payload}!</WithWebviewLink>
            );
          }
        }
      )
    );
};

export default main;
