import type { MessengerEventContext } from '@machinat/messenger';
import type MessengerAuth from '@machinat/messenger/webview';
import type { TelegramEventContext } from '@machinat/telegram';
import type TelegramAuth from '@machinat/telegram/webview';
import type { LineEventContext } from '@machinat/line';
import type LineAuth from '@machinat/line/webview';
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

export type WebUpdateAction = {
  category: 'action';
  type: 'update_todo';
  payload: {
    id: number;
    name: string;
  };
};

export type WebAppEventValue =
  | ConnectionEventValue
  | WebDeleteAction
  | WebUpdateAction;

export type WebAppEventContext = WebviewEventContext<
  MessengerAuth | TelegramAuth | LineAuth,
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

export type WebviewUpdatedPush = {
  category: 'webview_push';
  type: 'todo_updated';
  payload: {
    todo: Todo;
    name: string;
  };
};

export type WebviewPush =
  | WebviewDataPush
  | WebviewDeletedPush
  | WebviewUpdatedPush;
