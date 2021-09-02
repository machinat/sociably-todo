import Machinat from '@machinat/core';
import { build } from '@machinat/script';
import { IF, THEN, PROMPT, RETURN, CALL } from '@machinat/script/keywords';
import WithYesNoReplies from '../components/WithYesNoReplies';
import AddingTodo from './AddingTodo';
import { ChatEventContext } from '../types';

type AskingFirstTodoVars = {
  ok: boolean;
};

export default build<AskingFirstTodoVars>(
  {
    name: 'AskingFirstTodo',
    initVars: () => ({ ok: false }),
  },
  <>
    {() => (
      <WithYesNoReplies>
        <p>You don't have any todo. Do you want to create one now?</p>
      </WithYesNoReplies>
    )}

    <PROMPT<AskingFirstTodoVars, ChatEventContext>
      key="ask-adding"
      set={(_, { event }) => ({
        ok:
          event.type === 'quick_reply' ||
          event.type === 'callback_query' ||
          event.type === 'postback'
            ? JSON.parse(event.data!).action === 'yes'
            : event.type === 'text'
            ? /(ok|yes|👌)/i.test(event.text)
            : false,
      })}
    />

    <IF<AskingFirstTodoVars> condition={({ vars: { ok } }) => !ok}>
      <THEN>
        {() => <p>OK, tell me when you need!</p>}
        <RETURN />
      </THEN>
    </IF>

    <CALL key="adding-todo" script={AddingTodo} />
  </>
);
