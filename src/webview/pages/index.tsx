import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import { TodoState, WebAppPush } from '../../types';

const { publicRuntimeConfig } = getConfig();

const client = new WebviewClient<
  MessengerClientAuthorizer | TelegramClientAuthorizer | LineClientAuthorizer,
  WebAppPush
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
  const [todoState, dispatchState] = React.useReducer(
    (state: null | TodoState, event: WebAppPush): TodoState => {
      switch (event.type) {
        case 'todo_data':
          return event.payload.state;
        case 'todo_deleted':
          return {
            ...state,
            todos: state.todos.filter(
              (todo) => todo.id !== event.payload.todo.id
            ),
          };
        default:
          return state;
      }
    },
    null
  );

  React.useEffect(() => {
    client.onEvent(({ event }) => {
      dispatchState(event);
    });
  }, []);

  const todos = todoState?.todos.filter((todo) => !todo.finishAt);
  const history = todoState?.todos.filter((todo) => todo.finishAt);

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
              <th colSpan={2}>You have {todos ? todos.length : '?'} Todo</th>
            </tr>
          </thead>
          <tbody>
            {todos?.map((todo) => (
              <TodoRow todo={todo} />
            ))}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                You have {history ? history.length : '?'} finished Todo
              </th>
            </tr>
          </thead>
          <tbody>
            {history?.map((todo) => (
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
