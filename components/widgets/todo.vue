<template>
  <section>
    <Input
      v-model="newTodo"
      placeholder="What needs to be done?"
      autofocus
      @keyup.enter.native="addTodo"
    />
    <ol>
      <li v-for="todo in todos" :key="todo.id">
        <label :class="{ done: todo.done }"
          ><input
            v-model="todo.done"
            type="checkbox"
            @click="toggleDoneState(todo)"
          />{{ todo.title }}</label
        >
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
    <div class="stats" :style="donePercentage">
      <strong>{{ doneItems.length }} of {{ todos.length }}</strong> todos
      completed.
    </div>
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
  computed: {
    doneItems() {
      return this.todos.filter((todo) => todo.done)
    },
    donePercentage() {
      const doneItems = this.todos.filter((todo) => todo.done)

      const percentage =
        100 - ((this.todos.length - doneItems.length) * 100) / this.todos.length
      return `--percentage: ${percentage}%`
    },
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
  height: calc(100% - 0.65rem);
  position: absolute;
  top: calc(var(--widget-padding) * 0.5);
  right: calc(var(--widget-padding) * 0.5);
  left: calc(var(--widget-padding) * 0.5);
  bottom: calc(var(--widget-padding) * 0.5);
}
.done {
  text-decoration: line-through;
}

input {
  // margin: calc(var(--padding) / 4) 0;
  max-width: 100%;
  padding: calc(var(--padding) / 4) calc(var(--padding) / 4);
  margin-bottom: calc(var(--padding) / 4);
}

.stats {
  --percentage: 0%;
  font-size: 0.65rem;
  padding: calc(var(--widget-padding) * 0.5);
  margin-left: calc(var(--widget-padding) * -0.5);
  margin-right: calc(var(--widget-padding) * -0.5);
  position: relative;
  display: block;
  &::before {
    content: '';
    width: var(--percentage);
    height: calc(0.65rem / 4);
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: var(--accent-success);
  }
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
    font-size: 0.75rem;
    &:hover {
      background-color: var(--accent-100);
    }
    padding-left: calc(var(--padding) / 4);
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
    button.btn {
      justify-self: stretch;
      align-self: flex-start;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent !important;
      svg {
        fill: var(--text-color);
      }
      i {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>
