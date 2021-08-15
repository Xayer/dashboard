<template>
  <div class="todoApp">
    <h1>TODO</h1>
    <p>
      You have <strong>{{ todos.length }}</strong> tasks on your todo-list.
    </p>
    <Input
      v-model="newTodo"
      placeholder="What needs to be done?"
      autofocus
      @keyup.enter="addTodo"
    />
    <ol>
      <li v-for="todo in todos" :key="todo.id" class="m-b">
        <input
          v-model="todo.done"
          type="checkbox"
          @click="toggleDoneState(todo)"
        />
        <label :class="{ done: todo.done }">{{ todo.title }}</label>
        <Button class="danger m-l" @click="removeTodo(todo)">Remove</Button>
      </li>
    </ol>
  </div>
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
    this.todos = JSON.parse(localStorage.getItem(todosStorageKey) || '[]')
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
    },
    toggleDoneState(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1, {
        ...todo,
        done: !todo.done,
      })
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
    },
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      localStorage.setItem(todosStorageKey, JSON.stringify(this.todos))
    },
  },
}
</script>
<style scoped>
.done {
  text-decoration: line-through;
  color: gray;
}
li {
  list-style-type: none;
}
</style>
