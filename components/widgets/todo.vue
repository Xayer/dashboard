<template>
  <section>
    <Input
      key="add-item"
      v-model="newTodo"
      placeholder="What needs to be done?"
      @keyup.enter.native="addTodo"
    />
    <ol>
      <li v-for="todo in visibleTodoItems" :key="todo.id">
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
          v-dompurify-html="formatTodoTitle(todo.title)"
        />
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
    <div
      class="stats"
      :class="{ completed: allCompleted }"
      :style="`--percentage: ${donePercentage}%`"
    >
      <span>
        <template v-if="hideCompletedItems">
          <strong>{{ visibleTodoItems.length }}</strong
          >&nbsp;items left ({{ 100 - donePercentage }}%)
        </template>
        <template v-else>
          <strong>{{ doneItems.length }} of {{ todos.length }}</strong
          >&nbsp;items completed. ({{ donePercentage }}%)
        </template>
      </span>
      <span>
        <input v-model="hideCompletedItems" type="checkbox" /> hide completed.
      </span>
    </div>
  </section>
</template>
<script>
import { Button, Input } from '@/components/atoms'
import { todosStorageKey, todosHideCompletedKey } from '@/constants/todo'
import marked from 'marked'

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
      return this.hideCompletedItems
        ? this.todos.filter((todo) => !todo.done)
        : this.todos
    },
    doneItems() {
      return this.todos.filter((todo) => todo.done)
    },
    donePercentage() {
      if (!this.todos || this.todos.length === 0) {
        return 0
      }
      const doneItems = this.todos.filter((todo) => todo.done)

      const percentage =
        100 - ((this.todos.length - doneItems.length) * 100) / this.todos.length
      return percentage.toFixed(0)
    },
    allCompleted() {
      if (this.todos.length === 0) {
        return false
      }
      return this.todos.length === this.doneItems.length
    },
    userSettings() {
      return this.$store.state.userSettings.userSettings
    },
  },
  watch: {
    hideCompletedItems(hideCompletedItems) {
      localStorage.setItem(
        todosHideCompletedKey,
        JSON.stringify(hideCompletedItems)
      )
    },
    userSettings() {
      this.loadTodosFromStorage()
    },
  },
  created() {
    this.loadTodosFromStorage()
  },
  methods: {
    formatTodoTitle(title) {
      return marked.parse(title)
    },
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
      if (event.target.tagName === 'A') {
        return
      }
      const todoItem = this.todos.find((todo) => todo.id === id)
      if (!todoItem) {
        return
      }
      event.preventDefault()
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
      return this.todos.indexOf(todoItem)
    },
    saveModifiedTodoItem() {
      const existingTodoItem = this.findTodoItem(this.editGuid)
      const existingTodoItemIndex = this.findTodoItemIndex(existingTodoItem)
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
      const existingTodoItemIndex = this.findTodoItemIndex(
        this.findTodoItem(todoItem.id)
      )
      this.todos.splice(existingTodoItemIndex, 1, {
        ...todoItem,
        done: !todoItem.done,
      })
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()
    },
    removeTodo(todoItem) {
      const existingTodoItemIndex = this.findTodoItemIndex(
        this.findTodoItem(todoItem.id)
      )
      this.todos.splice(existingTodoItemIndex, 1)
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
      this.loadTodosFromStorage()
    },
    loadTodosFromStorage() {
      this.todos = JSON.parse(localStorage.getItem(todosStorageKey) || '[]')
      this.hideCompletedItems = JSON.parse(
        localStorage.getItem(todosHideCompletedKey) || false
      )
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

code {
  background-color: var(--accent-primary);
  padding: calc(var(--padding) / 12);
  border-radius: var(--radius);
  font-size: 0.75rem;
  font-weight: var(--weight-thin);
  color: var(--text-color);
}

input {
  max-width: 100%;
  padding: calc(var(--padding) / 4) calc(var(--padding) / 4);
  margin-bottom: calc(var(--padding) / 4);
}

.stats {
  --percentage: 0%;
  width: 100%;
  font-size: 0.65rem;
  padding: calc(var(--widget-padding) * 0.5);
  margin-left: calc(var(--widget-padding) * -0.5);
  margin-right: calc(var(--widget-padding) * -0.5);
  position: relative;
  display: flex;
  justify-content: space-between;
  &::before {
    transition: all 0.25s ease;
    content: '';
    width: var(--percentage);
    height: calc(0.65rem / 4);
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: var(--accent-primary);
  }
  &.completed::before {
    background-color: var(--accent-success);
  }
  span {
    margin: 0;
    display: flex;
    align-items: center;
  }
}

ol {
  display: block;
  width: 100%;
  flex: var(--padding);
  margin: 0;
  padding: 0;
  flex-direction: column;
  overflow-y: scroll;
  li + li {
    margin-top: calc(var(--padding) / 2);
  }
  li {
    width: 100%;
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
    span {
      display: block;
      -ms-word-break: break-all;
      word-break: break-all;
      padding: 0px !important;
      margin: 0px !important;
      p {
        padding: 0px;
        margin: 0px !important;
      }
      /* Non standard for WebKit */
      word-break: break-word;

      -webkit-hyphens: auto;
      -moz-hyphens: auto;
      hyphens: auto;
      width: 100%;
    }
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
<style>
ol li span p {
  margin: 0;
  padding: 0;
}
</style>
