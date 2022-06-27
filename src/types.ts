import type { MessengerEventContext } from '@sociably/messenger';
import type MessengerAuth from '@sociably/messenger/webview';
import type { TelegramEventContext } from '@sociably/telegram';
import type TelegramAuth from '@sociably/telegram/webview';
import type { LineEventContext } from '@sociably/line';
import type LineAuth from '@sociably/line/webview';
import type {
  WebviewEventContext,
  ConnectionEventValue,
} from '@sociably/webview';

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
