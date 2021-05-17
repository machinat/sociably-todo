import Machinat, { MachinatNode } from '@machinat/core';
import BaseTemplate from './BaseTemplate';
import { TodoState } from '../types';

type AnswerBasePanelProps = {
  children: MachinatNode;
  state: TodoState;
};

const AnswerBasePanel = ({ children, state }: AnswerBasePanelProps) => {
  const todoCount = state.todos.length;
  return (
    <>
      {children}
      <BaseTemplate>
        You have {todoCount > 0 ? todoCount : 'no'} todos now.
      </BaseTemplate>
    </>
  );
};

export default AnswerBasePanel;
