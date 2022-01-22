<template>
  <section>
    <Input
      key="add-item"
      v-model="newTodo"
      placeholder="What needs to be done?"
      @keyup.enter.native="addTodo"
    />
    <ol>
      <li v-for="(todo) in visibleTodoItems" :key="todo.id">
        <input
          v-model="todo.done"
          type="checkbox"
          @click="toggleDoneState(todo)"
        />

        <input
          v-if="editGuid === todo.id"
          v-model="existingTodo"
          class="edit-form"
          autofocus
          type="text"
          @blur="saveModifiedTodoItem"
        />
        <span
          v-show="editGuid !== todo.id"
          :class="{ done: todo.done }"
          @click="editTodo(todo.id, $event)"
          >{{ todo.title }}</span
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
      <p>
        <strong>{{ doneItems.length }} of {{ todos.length }}</strong> todos
      completed.
      </p>
      <span>
        <input
          v-model="hideCompletedItems"
          type="checkbox"
        /> hide completed.
      </span>
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
      editGuid: null,
      existingTodo: '',
      hideCompletedItems: false,
    }
  },
  computed: {
    visibleTodoItems() {
      return this.hideCompletedItems ? this.todos.filter((todo) => !todo.done) : this.todos;
    },
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
    editTodo(id, event) {
      const todoItem = this.todos.find((todo) => todo.id === id)
      if(!todoItem) {
        return
      }
      this.editGuid = id
      this.existingTodo = todoItem.title
      const parent = event.target.parentElement
      setTimeout(() => {
        parent.querySelector('.edit-form').focus()
      }, 50)
    },
    findTodoItem(guid) {
      return this.todos.find((todo) => todo.id === guid)
    },
    findTodoItemIndex(todoItem) {
      return this.todos.indexOf(todoItem);
    },
    saveModifiedTodoItem() {
      const existingTodoItem = this.findTodoItem(this.editGuid);
      const existingTodoItemIndex = this.findTodoItemIndex(existingTodoItem);
      this.todos.splice(existingTodoItemIndex, 1, {
        ...existingTodoItem,
        title: this.existingTodo,
      })
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()

      this.editGuid = null
      this.existingTodo = ''
    },
    toggleDoneState(todoItem) {
      const existingTodoItemIndex = this.findTodoItemIndex(this.findTodoItem(todoItem.id));
      this.todos.splice(existingTodoItemIndex, 1, {
        ...todoItem,
        done: !todoItem.done,
      })
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()
    },
    removeTodo(todoItem) {
      const existingTodoItemIndex = this.findTodoItemIndex(this.findTodoItem(todoItem.id));
      this.todos.splice(existingTodoItemIndex, 1);
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
  display: flex;
  justify-content: space-between;
  &::before {
    transition: width 0.25s ease;
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
    display: grid;
    grid-template-columns: 2rem auto 2rem;
    justify-content: stretch;
    align-items: center;
    gap: calc(var(--padding) / 4);
    input {
      &[type='checkbox'] {
        justify-self: stretch;
        text-align: left;
        flex-grow: 1;
      }

      &.edit-form {
        display: block;
        padding: 0;
        margin: 0;
      }
    }
    label {
      justify-self: flex-start;
      text-align: left;
      flex-grow: 1;
    }
    button.btn {
      justify-self: stretch;
      align-self: flex-start;
      display: inline-block;
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
