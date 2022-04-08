import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import {
  useEventReducer,
  useClient,
  ClientEventContext,
} from '@machinat/webview/client';
import MessengerAuth from '@machinat/messenger/webview/client';
import TelegramAuth from '@machinat/telegram/webview/client';
import LineAuth from '@machinat/line/webview/client';
import { Todo, TodoState, WebviewPush } from '../../src/types';

type WebviewEventContext = ClientEventContext<
  MessengerAuth | TelegramAuth | LineAuth,
  WebviewPush
>;

const reduceEvent = (
  currentData: null | TodoState,
  { event }: WebviewEventContext
): null | TodoState => {
  if (event.type === 'app_data') {
    return event.payload.data;
  }
  if (currentData && event.type === 'todo_deleted') {
    const { todos, finishedTodos } = currentData;
    const { id } = event.payload.todo;
    return {
      ...currentData,
      todos: todos.filter((todo) => todo.id !== id),
      finishedTodos: finishedTodos.filter((todo) => todo.id !== id),
    };
  }
  if (currentData && event.type === 'todo_updated') {
    const { todos, finishedTodos } = currentData;
    const { todo } = event.payload;
    const idx = todos.findIndex(({ id }) => id === todo.id);

    return {
      ...currentData,
      todos:
        idx !== -1
          ? [...todos.slice(0, idx), todo, ...todos.slice(idx + 1)]
          : todos,
      finishedTodos,
    };
  }
  return currentData;
};

const {
  publicRuntimeConfig: { messengerPageId, telegramBotName, lineLiffId },
} = getConfig();

const WebAppHome = () => {
  const client = useClient({
    mockupMode: typeof window === 'undefined',
    authPlatforms: [
      new MessengerAuth({ pageId: messengerPageId }),
      new TelegramAuth({ botName: telegramBotName }),
      new LineAuth({ liffId: lineLiffId }),
    ],
  });
  const data = useEventReducer<TodoState | null>(client, reduceEvent, null);

  const TodoRow = ({ todo, finished }: { todo: Todo; finished?: boolean }) => (
    <tr key={todo.id}>
      <td style={{ verticalAlign: 'middle' }}>{todo.name}</td>
      <td style={{ textAlign: 'right' }}>
        <button
          style={{ padding: '10px 15px' }}
          onClick={() =>
            client.send({
              category: 'action',
              type: 'delete_todo',
              payload: { id: todo.id },
            })
          }
        >
          <small>❌</small>
        </button>
        {finished ? null : (
          <button
            style={{ padding: '10px 15px' }}
            onClick={() => {
              const newName = window.prompt(
                'Enter the new todo name:',
                todo.name
              );
              if (newName) {
                client.send({
                  category: 'action',
                  type: 'update_todo',
                  payload: { id: todo.id, name: newName },
                });
              }
            }}
          >
            <small>📝</small>
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div>
      <Head>
        <title>Edit Todos</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </Head>

      <main>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                You have {data ? data.todos.length : '?'} Todo
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.todos.map((todo) => (
              <TodoRow key={todo.id} todo={todo} />
            ))}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                You have {data ? data.finishedTodos.length : '?'} finished Todo
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.finishedTodos.map((todo) => (
              <TodoRow key={todo.id} todo={todo} finished />
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

// to activate publicRuntimeConfig
export const getServerSideProps = () => ({ props: {} });
export default WebAppHome;
