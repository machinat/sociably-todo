import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient, { useEventReducer } from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import { Todo, TodoState, WebviewPush } from '../../types';

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

const WebAppHome = () => {
  const data = useEventReducer<null | TodoState>(
    client,
    (currentData, { event }) => {
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
        console.log(todo, todos);
        return {
          ...currentData,
          todos:
            idx !== -1
              ? [...todos.slice(0, idx), todo, ...todos.slice(idx + 1)]
              : todos,
          finishedTodos,
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
              <TodoRow todo={todo} finished />
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
