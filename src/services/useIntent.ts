import { makeFactoryProvider, IntentRecognizer } from '@sociably/core';
import { ChatEventContext } from '../types';

const useIntent =
  (recognizer: IntentRecognizer) =>
  async (event: ChatEventContext['event']) => {
    if (event.type === 'text') {
      const intent = await recognizer.detectText(event.channel, event.text);
      return intent;
    }

    if (
      (event.platform === 'messenger' &&
        (event.type === 'quick_reply' || event.type === 'postback')) ||
      (event.platform === 'telegram' && event.type === 'callback_query') ||
      (event.platform === 'line' && event.type === 'postback')
    ) {
      if (event.data) {
        const { action, ...payload } = JSON.parse(event.data);
        return {
          type: action,
          confidence: 1,
          payload,
        };
      }
    }

    return {
      type: undefined,
      confidence: 0,
      payload: null,
    };
  };

export default makeFactoryProvider({
  deps: [IntentRecognizer],
})(useIntent);
