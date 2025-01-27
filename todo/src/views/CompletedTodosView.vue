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
    <h2>Klara Todos</h2>
    <p v-if="completedTodos.length === 0">Det finns inga klara Todos just nu! 🎉</p>
    <ul v-else>
      <li v-for="todo in completedTodos" :key="todo.id">
        <SingleTodo :todo-text="todo.text" :complete="todo.complete" :id="todo.id" :deadline="todo.deadline"@remove-todo="removeTodoFromList" />
      </li>
    </ul>
    <button class="clear-button" v-if="completedTodos.length > 0" @click="clearCompletedTodos">Rensa bort alla klara Todos</button>
  </main>
</template>

<style scoped>
  .clear-button {
    align-items: center;
    width: 100%;
    margin-top: 30px;
  }
</style>


