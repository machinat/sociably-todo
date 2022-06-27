import Sociably from '@sociably/core';
import Http from '@sociably/http';
import Messenger from '@sociably/messenger';
import MessengerAuth from '@sociably/messenger/webview';
import Line from '@sociably/line';
import LineAuth from '@sociably/line/webview';
import Telegram from '@sociably/telegram';
import TelegramAuth from '@sociably/telegram/webview';
import Webview from '@sociably/webview';
import DialogFlow from '@sociably/dialogflow';
import RedisState from '@sociably/redis-state';
import { FileState } from '@sociably/dev-tools';
import Script from '@sociably/script';
import AddingTodo from './scenes/AddingTodo';
import AskingFirstTodo from './scenes/AskingFirstTodo';
import nextConfigs from '../webview/next.config.js';
import TodoController from './services/TodoController';
import useIntent from './services/useIntent';
import useUserProfile from './services/useUserProfile';
import recognitionData from './recognitionData';
import { WebAppEventValue } from './types';

const {
  // basic
  APP_NAME,
  NODE_ENV,
  PORT,
  DOMAIN,
  // webview
  WEBVIEW_AUTH_SECRET,
  // messenger
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  // telegram
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_BOT_NAME,
  TELEGRAM_SECRET_PATH,
  // line
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET,
  LINE_LIFF_ID,
  // redis
  REDIS_URL,
  // dialogflow
  DIALOG_FLOW_PROJECT_ID,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PRIVATE_KEY,
  GOOGLE_APPLICATION_CREDENTIALS,
} = process.env as Record<string, string>;

const DEV = NODE_ENV !== 'production';

type CreateAppOptions = {
  noServer?: boolean;
};

const createApp = (options?: CreateAppOptions) => {
  return Sociably.createApp({
    modules: [
      Http.initModule({
        noServer: options?.noServer,
        listenOptions: {
          port: PORT ? Number(PORT) : 8080,
        },
      }),

      DEV
        ? FileState.initModule({
            path: './.state_data.json',
          })
        : RedisState.initModule({
            clientOptions: {
              url: REDIS_URL,
            },
          }),

      Script.initModule({
        libs: [AddingTodo, AskingFirstTodo],
      }),

      DialogFlow.initModule({
        recognitionData,
        projectId: DIALOG_FLOW_PROJECT_ID,
        environment: `sociably-todo-${DEV ? 'dev' : 'prod'}`,
        clientOptions: GOOGLE_APPLICATION_CREDENTIALS
          ? undefined
          : {
              credentials: {
                client_email: DIALOG_FLOW_CLIENT_EMAIL,
                private_key: DIALOG_FLOW_PRIVATE_KEY,
              },
            },
      }),
    ],

    platforms: [
      Messenger.initModule({
        webhookPath: '/webhook/messenger',
        pageId: MESSENGER_PAGE_ID,
        appSecret: MESSENGER_APP_SECRET,
        accessToken: MESSENGER_ACCESS_TOKEN,
        verifyToken: MESSENGER_VERIFY_TOKEN,
      }),

      Telegram.initModule({
        webhookPath: '/webhook/telegram',
        botName: TELEGRAM_BOT_NAME,
        botToken: TELEGRAM_BOT_TOKEN,
        secretPath: TELEGRAM_SECRET_PATH,
      }),

      Line.initModule({
        webhookPath: '/webhook/line',
        providerId: LINE_PROVIDER_ID,
        channelId: LINE_CHANNEL_ID,
        accessToken: LINE_ACCESS_TOKEN,
        channelSecret: LINE_CHANNEL_SECRET,
        liffId: LINE_LIFF_ID,
      }),

      Webview.initModule<
        MessengerAuth | TelegramAuth | LineAuth,
        WebAppEventValue
      >({
        webviewHost: DOMAIN,
        webviewPath: '/webview',

        authSecret: WEBVIEW_AUTH_SECRET,
        cookieSameSite: 'none',
        authPlatforms: [MessengerAuth, TelegramAuth, LineAuth],
        basicAuth: {
          appName: APP_NAME,
          appIconUrl: 'https://sociably.js.org/img/logo.jpg',
        },

        noNextServer: options?.noServer,
        nextServerOptions: {
          dev: DEV,
          dir: './webview',
          conf: nextConfigs,
        },
      }),
    ],

    services: [useIntent, useUserProfile, TodoController],
  });
};

export default createApp;
