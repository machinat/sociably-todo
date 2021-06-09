import { MachinatChannel } from '@machinat/core';
import { makeClassProvider } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { TodoState, Todo } from '../types';

export class TodoController {
  stateController: StateController;

  constructor(stateController: StateController) {
    this.stateController = stateController;
  }

  async getTodos(
    channel: MachinatChannel
  ): Promise<{ todo: null; data: TodoState }> {
    const data = await this.stateController
      .channelState(channel)
      .get<TodoState>('todo_data');

    return {
      todo: null,
      data: data || { currentId: 0, todos: [], finishedTodos: [] },
    };
  }

  async addTodo(
    channel: MachinatChannel,
    name: string
  ): Promise<{ todo: Todo; data: TodoState }> {
    const data = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        (currentData = { currentId: 0, todos: [], finishedTodos: [] }) => {
          const { currentId, todos, finishedTodos } = currentData;
          return {
            currentId: currentId + 1,
            todos: [...todos, { id: currentId + 1, name }],
            finishedTodos,
          };
        }
      );
    return { todo: data.todos[data.todos.length - 1], data };
  }

  async finishTodo(
    channel: MachinatChannel,
    id: number
  ): Promise<{ todo: null | Todo; data: TodoState }> {
    let finishingTodo: undefined | Todo;

    const data = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        (currentData = { currentId: 0, todos: [], finishedTodos: [] }) => {
          const { currentId, todos, finishedTodos } = currentData;

          finishingTodo = todos.find((todo) => todo.id === id);
          if (!finishingTodo) {
            return currentData;
          }

          return {
            currentId,
            todos: todos.filter((todo) => todo.id !== id),
            finishedTodos: [...finishedTodos, finishingTodo],
          };
        }
      );
    return { todo: finishingTodo || null, data };
  }

  async deleteTodo(
    channel: MachinatChannel,
    id: number
  ): Promise<{ todo: null | Todo; data: TodoState }> {
    let deletingTodo: undefined | Todo;

    const data = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        (currentData = { currentId: 0, todos: [], finishedTodos: [] }) => {
          const { currentId, todos, finishedTodos } = currentData;
          deletingTodo =
            todos.find((todo) => todo.id === id) ||
            finishedTodos.find((todo) => todo.id === id);

          if (!deletingTodo) {
            return currentData;
          }

          return {
            currentId,
            todos: todos.filter((todo) => todo.id !== id),
            finishedTodos: finishedTodos.filter((todo) => todo.id !== id),
          };
        }
      );
    return { todo: deletingTodo || null, data };
  }
}

export default makeClassProvider({
  deps: [StateController],
})(TodoController);
