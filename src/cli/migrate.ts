#!/usr/bin/env node
import { resolve as resolvePath } from 'path';
import Machinat from '@machinat/core';
import Messenger from '@machinat/messenger';
import Telegram from '@machinat/telegram';
import Line from '@machinat/line';
import { Umzug, JSONStorage } from 'umzug';
import commander from 'commander';

const {
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  TELEGRAM_BOT_TOKEN,
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
} = process.env as Record<string, string>;

const app = Machinat.createApp({
  platforms: [
    Messenger.initModule({
      pageId: Number(MESSENGER_PAGE_ID),
      accessToken: MESSENGER_ACCESS_TOKEN,
      noServer: true,
    }),

    Telegram.initModule({
      botToken: TELEGRAM_BOT_TOKEN,
      noServer: true,
    }),

    Line.initModule({
      providerId: LINE_PROVIDER_ID,
      channelId: LINE_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      noServer: true,
    }),
  ],
});

const umzug = new Umzug({
  storage: new JSONStorage({
    path: resolvePath('./.executed_migrations.json'),
  }),
  logger: console,
  context: app,
  migrations: {
    glob: resolvePath(
      __dirname,
      `../migrations/*.${__dirname.includes('/src/') ? 'ts' : 'js'}`
    ),
    resolve: ({ name, path, context: app }) => {
      return {
        name: name.replace(/.[t|j]s$/, ''),
        up: async () => {
          const { up } = await import(path as string);
          if (up) {
            const scope = app.serviceSpace.createScope();
            await scope.injectContainer(up);
          }
        },
        down: async () => {
          const { down } = await import(path as string);
          if (down) {
            const scope = app.serviceSpace.createScope();
            await scope.injectContainer(down);
          }
        },
      };
    },
  },
});

commander
  .usage('[options]')
  .option('--down', 'roll back down')
  .parse(process.argv);

const options = commander.opts();

async function migrate() {
  await app.start();

  if (options.down) {
    await umzug.down();
  } else {
    await umzug.up();
  }

  await app.stop();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
