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

export type Todo = {
  id: number;
  name: string;
  finishAt?: number;
};

export type TodoState = {
  currentId: number;
  todos: Todo[];
};

export type WebDeleteAction = {
  category: 'action';
  type: 'delete_todo';
  payload: {
    id: number;
  };
};

export type WebAppEventValue = ConnectionEventValue | WebDeleteAction;

export type WebAppEventContext = WebviewEventContext<
  MessengerServerAuthorizer | TelegramServerAuthorizer | LineServerAuthorizer,
  WebAppEventValue
>;

export type AppEventContext = ChatEventContext | WebAppEventContext;

export type WebDataPush = {
  category: 'push';
  type: 'todo_data';
  payload: {
    state: TodoState;
  };
};

export type WebDeletedPush = {
  category: 'push';
  type: 'todo_deleted';
  payload: {
    todo: Todo;
  };
};

export type WebAppPush = WebDataPush | WebDeletedPush;
