import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient, { useEventReducer } from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import { TodoState, WebviewPush } from '../../types';

const { publicRuntimeConfig } = getConfig();

const client = new WebviewClient<
  MessengerClientAuthorizer | TelegramClientAuthorizer | LineClientAuthorizer,
  WebviewPush
>(
  typeof window === 'undefined'
    ? { mockupMode: true, authorizers: [] }
    : {
        authorizers: [
          new MessengerClientAuthorizer({
            appId: publicRuntimeConfig.messengerAppId,
          }),
          new TelegramClientAuthorizer(),
          new LineClientAuthorizer({
            liffId: publicRuntimeConfig.lineLiffId,
          }),
        ],
      }
);

const TodoRow = ({ todo }) => (
  <tr>
    <td style={{ verticalAlign: 'middle' }}>{todo.name}</td>
    <td style={{ textAlign: 'right' }}>
      <button
        onClick={() =>
          client.send({
            category: 'action',
            type: 'delete_todo',
            payload: { id: todo.id },
          })
        }
      >
        ❌
      </button>
    </td>
  </tr>
);

const WebAppHome = () => {
  const data = useEventReducer(
    client,
    (data: null | TodoState, { event }) => {
      if (event.type === 'app_data') {
        return event.payload.data;
      }

      if (event.type === 'todo_deleted') {
        const { id } = event.payload.todo;
        return {
          ...data,
          todos: data.todos.filter((todo) => todo.id !== id),
          finishedTodos: data.finishedTodos.filter((todo) => todo.id !== id),
        };
      }

      return data;
    },
    null
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
        <h3>Press ❌ to delete todos</h3>

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
              <TodoRow todo={todo} />
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
              <TodoRow todo={todo} />
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
