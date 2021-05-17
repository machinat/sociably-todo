import { MachinatChannel } from '@machinat/core';
import { makeClassProvider } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { TodoState, Todo } from '../types';

type TodoActionResult = {
  todo: null | Todo;
  state: TodoState;
};

const initState = () => ({ currentId: 0, history: [], todos: [] });

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

    return { todo: null, state: state || initState() };
  }

  async addTodo(
    channel: MachinatChannel,
    name: string
  ): Promise<TodoActionResult & { todo: Todo }> {
    const state = await this.stateController
      .channelState(channel)
      .update<TodoState>(
        'todo_data',
        ({ currentId, todos, history } = initState()) => ({
          currentId: currentId + 1,
          todos: [...todos, { id: currentId + 1, name }],
          history,
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
        ({ currentId, todos, history } = initState()) => {
          finishingTodo = todos.find((todo) => todo.id === id);
          if (!finishingTodo) {
            return { currentId, todos, history };
          }

          return {
            currentId: currentId,
            todos: todos.filter((todo) => todo.id !== id),
            history: [...history, { ...finishingTodo, finishAt: Date.now() }],
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
        ({ currentId, todos, history } = initState()) => {
          deletingTodo =
            todos.find((todo) => todo.id === id) ||
            history.find((todo) => todo.id === id);

          if (!deletingTodo) {
            return { currentId, todos, history };
          }

          return {
            currentId: currentId,
            todos: todos.filter((todo) => todo.id !== id),
            history: history.filter((todo) => todo.id !== id),
          };
        }
      );
    return { todo: deletingTodo || null, state };
  }
}

export default makeClassProvider({ deps: [StateController] })(TodoController);
