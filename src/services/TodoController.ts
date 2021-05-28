import { MachinatChannel } from '@machinat/core';
import { makeClassProvider } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { TodoState, Todo } from '../types';

type TodoActionResult = {
  todo: null | Todo;
  state: TodoState;
};

export class TodoController {
  stateController: StateController;

  constructor(stateController: StateController) {
    this.stateController = stateController;
  }

  async getTodos(
    channel: MachinatChannel
  ): Promise<TodoActionResult & { todo: null }> {
    const state = await this.stateController
      .channelState(channel)
      .get<TodoState>('todo_data');

    return { todo: null, state: state || { currentId: 0, todos: [] } };
  }

  async addTodo(
    channel: MachinatChannel,
    name: string
  ): Promise<TodoActionResult & { todo: Todo }> {
    const state = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        ({ currentId, todos } = { currentId: 0, todos: [] }) => ({
          currentId: currentId + 1,
          todos: [...todos, { id: currentId + 1, name }],
        })
      );
    return { todo: state.todos[state.todos.length - 1], state };
  }

  async finishTodo(
    channel: MachinatChannel,
    id: number
  ): Promise<TodoActionResult> {
    let finishingTodo: undefined | Todo;

    const state = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        ({ currentId, todos } = { currentId: 0, todos: [] }) => {
          const todoIdx = todos.findIndex((todo) => todo.id === id);
          if (todoIdx === -1) {
            return { currentId, todos };
          }

          const todo = todos[todoIdx];
          if (todo.finishAt) {
            return { currentId, todos };
          }

          finishingTodo = { ...todo, finishAt: Date.now() };
          return {
            currentId: currentId,
            todos: [
              ...todos.slice(0, todoIdx),
              finishingTodo,
              ...todos.slice(todoIdx + 1),
            ],
          };
        }
      );
    return { todo: finishingTodo || null, state };
  }

  async deleteTodo(
    channel: MachinatChannel,
    id: number
  ): Promise<TodoActionResult> {
    let deletingTodo: undefined | Todo;

    const state = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        ({ currentId, todos } = { currentId: 0, todos: [] }) => {
          deletingTodo = todos.find((todo) => todo.id === id);

          if (!deletingTodo) {
            return { currentId, todos };
          }

          return {
            currentId: currentId,
            todos: todos.filter((todo) => todo.id !== id),
          };
        }
      );
    return { todo: deletingTodo || null, state };
  }
}

export default makeClassProvider({ deps: [StateController] })(TodoController);
