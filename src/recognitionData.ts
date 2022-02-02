export default {
  defaultLanguage: 'en',
  languages: ['en'],
  intents: {
    add: {
      trainingPhrases: {
        en: ['add', 'new', 'add todo', 'new todo', 'create todo'],
      },
    },
    list: {
      trainingPhrases: {
        en: ['todos', 'show todos', 'list todos', 'my todos', 'check todos'],
      },
    },
    edit: {
      trainingPhrases: {
        en: ['edit', 'edit todos', 'update todos', 'delete todos'],
      },
    },
  },
};
