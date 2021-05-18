#!/usr/bin/env node
import { parse as parseUrl } from 'url';
import { config as configEnv } from 'dotenv';
import localtunnel from 'localtunnel';
import nodemon from 'nodemon';

configEnv();
const { PORT, DEV_TUNNEL_SUBDOMAIN } = process.env;

async function dev() {
  const tunnel = await localtunnel({
    port: PORT,
    host: 'https://t.machinat.dev',
    subdomain: DEV_TUNNEL_SUBDOMAIN,
  });

  process.on('SIGINT', () => {
    tunnel.close();
    process.exit();
  });

  if (
    parseUrl(tunnel.url).hostname !== `${DEV_TUNNEL_SUBDOMAIN}.t.machinat.dev`
  ) {
    console.log(
      `[dev:tunnel] Error: subdomain "${DEV_TUNNEL_SUBDOMAIN}" is not available, please try later or change the subdomain setting (need rerun migrations)`
    );
    tunnel.close();
    process.exit(1);
  }

  console.log(
    `[dev:tunnel] Tunnel from ${tunnel.url} to http://localhost:${PORT} is opened`
  );
  tunnel.on('close', () => {
    console.log(
      `[dev:tunnel] Tunnel from ${tunnel.url} to http://localhost:${PORT} is closed`
    );
  });

  nodemon({
    exec: 'ts-node -r dotenv/config',
    script: './src/index.ts',
    watch: './src',
    ext: 'ts,tsx',
    ignore: ['./src/webview'],
    verbose: true,
  });
  nodemon.on('start', () => {
    console.log(`[dev:server] Dev server is running on ${PORT} port`);
  });
  nodemon.on('restart', (changes: string[]) => {
    console.log(
      `[dev:server] Restarting server. File changed: ${changes.join(', ')}`
    );
  });
}

dev();
