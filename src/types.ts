import type { MessengerEventContext } from '@machinat/messenger';
import type { MessengerServerAuthorizer } from '@machinat/messenger/webview';
import type { TelegramEventContext } from '@machinat/telegram';
import type { TelegramServerAuthorizer } from '@machinat/telegram/webview';
import type { LineEventContext } from '@machinat/line';
import type { LineServerAuthorizer } from '@machinat/line/webview';
import type {
  WebviewEventContext,
  ConnectionEventValue,
} from '@machinat/webview';

export type ChatEventContext =
  | MessengerEventContext
  | TelegramEventContext
  | LineEventContext;

export type HelloEventValue = {
  category: 'greeting';
  type: 'hello';
  payload: string;
};

export type WebAppEventValue = ConnectionEventValue | HelloEventValue;

export type WebAppEventContext = WebviewEventContext<
  MessengerServerAuthorizer | TelegramServerAuthorizer | LineServerAuthorizer,
  WebAppEventValue
>;

export type AppEventContext = ChatEventContext | WebAppEventContext;
