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
};

export type TodoState = {
  currentId: number;
  todos: Todo[];
  finishedTodos: Todo[];
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

export type WebviewDataPush = {
  category: 'webview_push';
  type: 'app_data';
  payload: {
    data: TodoState;
  };
};

export type WebviewDeletedPush = {
  category: 'webview_push';
  type: 'todo_deleted';
  payload: {
    todo: Todo;
  };
};

export type WebviewPush = WebviewDataPush | WebviewDeletedPush;
