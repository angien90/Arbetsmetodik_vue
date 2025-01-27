<script setup lang="ts">
import { computed } from 'vue';
import SingleTodo from '@/components/SingleTodo.vue';
import { useTodosStore } from '@/stores/todos.ts';
import { storeToRefs } from 'pinia';

const todoStore = useTodosStore();
const { todos } = storeToRefs(todoStore);

const completedTodos = computed(() => todos.value.filter(todo => todo.complete));

function removeTodoFromList(id: number) {
  todoStore.deleteTodo(id);
}

function clearCompletedTodos() {
  const confirmClear = confirm('Är du säker på att du vill ta bort alla klara Todos?');
  if (confirmClear) {
    const remainingTodos = todos.value.filter(todo => !todo.complete);
    todos.value = remainingTodos;
    todoStore.saveTodosToLocalStorage();
    alert('Alla klara Todos har tagits bort.');
  }
}
</script>

<template>
  <main>
    <h1>Klara Todos</h1>
    <p v-if="completedTodos.length === 0">Det finns inga klara Todos just nu! 🎉</p>
    <ul v-else>
      <li v-for="todo in completedTodos" :key="todo.id">
        <SingleTodo 
          :todo-text="todo.text" 
          :complete="todo.complete" 
          :id="todo.id" 
          :deadline="todo.deadline"
          @remove-todo="removeTodoFromList" 
        />
      </li>
    </ul>
    <button v-if="completedTodos.length > 0" @click="clearCompletedTodos">
      Rensa alla klara Todos
    </button>
  </main>
</template>

<style scoped>
main {
  margin: 20px;
  text-align: center;
}

h1 {
  font-size: 2rem;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: gray;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: lightblue;
  border: 2px solid black;
  color: black;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
}
</style>

