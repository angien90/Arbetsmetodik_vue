<script setup lang="ts">
import { ref, computed } from 'vue';
import SingleTodo from '@/components/SingleTodo.vue';
import { useTodosStore } from '@/stores/todos.ts';
import { storeToRefs } from 'pinia';

const todoStore = useTodosStore();
const { todos } = storeToRefs(todoStore);
const showCompletedMessage = ref(false);
const todoName = ref('');
const filter = ref<'Klar' | 'Inte klar' | 'Förfallna todos' | 'Visa alla'>('Visa alla');

const today = computed(() => new Date().toISOString().slice(0, 10));
const todoDate = ref(today.value);

const filteredTodos = computed(() => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  return todos.value.filter(todo => {
    if (filter.value === 'Visa alla') return true;
    if (filter.value === 'Klar') return todo.complete;
    if (filter.value === 'Inte klar') return !todo.complete;
    if (filter.value === 'Förfallna todos') {
      const deadlineDate = new Date(todo.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      return !todo.complete && deadlineDate < todayDate;
    }
  });
});

function addTodo() {
  if (todoName.value.trim()) {
    todoStore.addNewTodo(todoName.value, false, today.value);
    todoName.value = '';
  }
}

function onTaskCompleted() {
  showCompletedMessage.value = true;
  setTimeout(clearMessage, 3000);
}

function clearMessage() {
  showCompletedMessage.value = false;
}

function removeTodoFromList(id: number) {
  todoStore.deleteTodo(id);
}

function deleteFinishedTodos() {
  const completedTodos = todos.value.filter(todo => todo.complete);
  if (!completedTodos.length || !confirm(`Vill du ta bort ${completedTodos.length} klar/klara Todos?`)) return;

  todos.value = todos.value.filter(todo => !todo.complete);
  todoStore.saveTodosToLocalStorage();
  alert(`${completedTodos.length} klar/klara Todos har tagits bort.`);
}
</script>

<template>
  <main>
    <h1>Mission Possible</h1>
    <h2>Gör dina uppdrag möjliga</h2>

    <section class="input-container">
      <h3>Lägg till en ny task</h3>
      <input type="text" v-model="todoName" @keyup.enter="addTodo" placeholder="Skriv in ett nytt uppdrag här..." />
      <section class="form-group">
        <label for="deadline">Ange deadline</label>
        <input type="date" id="deadline" v-model="todoDate" />
        <button @click="addTodo">Lägg till task</button>
      </section>
    </section>
  </main>

  <main>
    <section class="filter-and-button-wrapper">
      <h2>Dina Tasks</h2>
      <label for="todo-filter">Filtrera tasks:</label>
      <select id="todo-filter" v-model="filter">
        <option value="Visa alla">Alla tasks</option>
        <option value="Klar">Klara</option>
        <option value="Inte klar">Inte klara</option>
        <option value="Förfallna todos">Förfallna</option>
      </select>
      <button @click="deleteFinishedTodos">Ta bort alla färdiga tasks</button>
    </section>

    <section class="my-task-list">
      <p v-if="showCompletedMessage">Snyggt jobbat med att göra klart en uppgift! 🎉</p>
      <ul>
        <li v-for="todo in filteredTodos" :key="todo.id">
          <SingleTodo
            :todo-text="todo.text"
            :complete="todo.complete"
            :id="todo.id"
            :deadline="todo.deadline"
            @task-completed="onTaskCompleted"
            @remove-todo="removeTodoFromList"
          />
        </li>
      </ul>
      <p v-if="todos.length === 0">Du är klar med alla uppgifter! 👏👏👏</p>
    </section>
  </main>
</template>

<style>
body {
  font-family: 'Delius', sans-serif;
  background-color: #f3f4f6;
  color: #333;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  width: 80%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1,
h2,
h3 {
  text-align: center;
  margin: 0;
}

h2 {
  font-weight: lighter;
  color: #555;
  margin-bottom: 10px;
}

h3 {
  font-size: 1em;
}

.input-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.input-container h3 {
  margin-bottom: 10px;
  color: #555;
}

.input-container input {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  margin-bottom: 10px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 1em;
}

.input-container input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
}

.form-group button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

button {
  padding: 10px 20px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

button:hover {
  background-color: #1d4ed8;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.filter-and-button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-and-button-wrapper label {
  font-size: 1em;
  color: #555;
}

.filter-and-button-wrapper select {
  padding: 10px;
  font-size: 1em;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  background-color: #fff;
}

ul,
li {
  margin: 10px 0;
  padding: 0;
  list-style: none;
}
</style>
