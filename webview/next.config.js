const { MESSENGER_APP_ID, LINE_LIFF_ID } = process.env;

module.exports = {
  distDir: '../dist',
  basePath: '/webview',
  publicRuntimeConfig: {
    messengerAppId: MESSENGER_APP_ID,
    lineLiffId: LINE_LIFF_ID,
  },
};
