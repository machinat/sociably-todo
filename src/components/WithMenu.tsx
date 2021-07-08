import Machinat, { MachinatNode } from '@machinat/core';
import MenuTemplate from './MenuTemplate';

type WithMenuProps = {
  children: MachinatNode;
  todoCount: number;
};

const WithMenu = ({ children, todoCount }: WithMenuProps) => {
  return (
    <>
      {children}
      <MenuTemplate>
        You have {todoCount > 0 ? <b>{todoCount}</b> : 'no'} todos now.
      </MenuTemplate>
    </>
  );
};

export default WithMenu;
