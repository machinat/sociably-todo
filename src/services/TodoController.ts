import {
  makeClassProvider,
  StateController,
  SociablyChannel,
} from '@sociably/core';
import { TodoState, Todo } from '../types';

export class TodoController {
  stateController: StateController;

  constructor(stateController: StateController) {
    this.stateController = stateController;
  }

  async getTodos(
    channel: SociablyChannel
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
    channel: SociablyChannel,
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
    channel: SociablyChannel,
    id: number
  ): Promise<{ todo: null | Todo; data: TodoState }> {
    let finishingTodo: null | Todo = null;

    const data = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        (currentData = { currentId: 0, todos: [], finishedTodos: [] }) => {
          const { currentId, todos, finishedTodos } = currentData;

          finishingTodo = todos.find((todo) => todo.id === id) || null;
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
    return { todo: finishingTodo, data };
  }

  async updateTodo(
    channel: SociablyChannel,
    id: number,
    name: string
  ): Promise<{ todo: null | Todo; data: TodoState }> {
    let finishingTodo: null | Todo = null;

    const data = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        (currentData = { currentId: 0, todos: [], finishedTodos: [] }) => {
          const { currentId, todos, finishedTodos } = currentData;

          const updatingIdx = todos.findIndex((todo) => todo.id === id);
          if (updatingIdx === -1) {
            return currentData;
          }

          finishingTodo = { id, name };
          return {
            currentId,
            todos: [
              ...todos.slice(0, updatingIdx),
              finishingTodo,
              ...todos.slice(updatingIdx + 1),
            ],
            finishedTodos,
          };
        }
      );
    return { todo: finishingTodo, data };
  }

  async deleteTodo(
    channel: SociablyChannel,
    id: number
  ): Promise<{ todo: null | Todo; data: TodoState }> {
    let deletingTodo: null | Todo = null;

    const data = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        (currentData = { currentId: 0, todos: [], finishedTodos: [] }) => {
          const { currentId, todos, finishedTodos } = currentData;
          deletingTodo =
            todos.find((todo) => todo.id === id) ||
            finishedTodos.find((todo) => todo.id === id) ||
            null;

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
    return { todo: deletingTodo, data };
  }
}

export default makeClassProvider({
  deps: [StateController],
})(TodoController);
