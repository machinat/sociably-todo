export default {
  defaultLanguage: 'en',
  languages: ['en'],
  intents: {
    addTodo: {
      trainingPhrases: {
        en: ['add', 'new', 'add todo', 'new todo', 'create todo'],
      },
    },
    listTodos: {
      trainingPhrases: {
        en: ['todos', 'show todos', 'list todos', 'my todos', 'check todos'],
      },
    },
    editTodos: {
      trainingPhrases: {
        en: ['edit', 'edit todos', 'update todos', 'delete todos'],
      },
    },
  },
};
