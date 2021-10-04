<template>
  <section>
    <span>
      <strong>{{ todos.length }}</strong> tasks on your list
    </span>
    <Input
      v-model="newTodo"
      placeholder="What needs to be done?"
      autofocus
      @keyup.enter="addTodo"
    />
    <ol>
      <li v-for="todo in todos" :key="todo.id">
        <input
          v-model="todo.done"
          type="checkbox"
          @click="toggleDoneState(todo)"
        />
        <label :class="{ done: todo.done }">{{ todo.title }}</label>
        <Button class="sm" @click="removeTodo(todo)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"
            />
          </svg>
        </Button>
      </li>
    </ol>
  </section>
</template>
<script>
import { Button, Input } from '@/components/atoms'
import { todosStorageKey } from '@/constants/todo'

export default {
  components: { Button, Input },
  data() {
    return {
      newTodo: '',
      todos: [],
    }
  },
  created() {
    this.loadTodosFromStorage()
  },
  methods: {
    addTodo() {
      this.todos.push({
        id: Date.now(),
        title: this.newTodo,
        done: false,
      })
      this.newTodo = ''
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()
    },
    toggleDoneState(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1, {
        ...todo,
        done: !todo.done,
      })
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()
    },
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()
    },
    loadTodosFromStorage() {
      this.todos = JSON.parse(localStorage.getItem(todosStorageKey) || '[]')
    },
  },
}
</script>
<style lang="scss" scoped>
section {
  display: flex;
  max-width: 100%;
  flex-direction: column;
  height: 100%;
}
.done {
  text-decoration: line-through;
  color: gray;
}

input {
  display: block;
  margin: calc(var(--padding) / 4) 0;
  max-width: 100%;
}

ol {
  display: flex;
  flex: var(--padding);
  margin: 0;
  padding: 0;
  flex-direction: column;
  overflow-y: scroll;
  gap: calc(var(--padding) / 4);
  li {
    border-radius: var(--radius);
    border: 1px solid var(--accent-0);
    background-color: var(--accent-50);
    box-sizing: border-box;
    &:hover {
      background-color: var(--accent-100);
    }
    padding-left: calc(var(--padding) / 2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: calc(var(--padding) / 4);
    input {
      width: auto;
    }
    label {
      justify-self: flex-start;
      text-align: left;
      flex-grow: 1;
    }
    button {
      justify-self: stretch;
      align-self: flex-start;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>
