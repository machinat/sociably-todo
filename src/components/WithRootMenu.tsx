import Machinat, { MachinatNode } from '@machinat/core';
import RootMenuTemplate from './RootMenuTemplate';

type WithRootMenuProps = {
  children: MachinatNode;
  todoCount: number;
};

const WithRootMenu = ({ children, todoCount }: WithRootMenuProps) => {
  return (
    <>
      {children}
      <RootMenuTemplate>
        You have {todoCount > 0 ? todoCount : 'no'} todos now.
      </RootMenuTemplate>
    </>
  );
};

export default WithRootMenu;
