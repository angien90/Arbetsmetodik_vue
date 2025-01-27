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

const today = computed(() => {
  return new Date().toISOString().slice(0, 10);
});

const todoDate = ref(today.value);

const filteredTodos = computed(() => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); 

  switch (filter.value) {
    case 'Klar':
      return todos.value.filter(todo => todo.complete);
    case 'Inte klar':
      return todos.value.filter(todo => !todo.complete);
    case 'Förfallna todos':
      return todos.value.filter(todo => {
        const deadlineDate = new Date(todo.deadline);
        deadlineDate.setHours(0, 0, 0, 0); 

        return !todo.complete && deadlineDate < todayDate;
      });
    default:
      return todos.value; // Visa alla todos
  }
});

function addTodo() {
  if (todoName.value.trim() === '') return; 
  const currentDeadline = todoDate.value ? new Date(todoDate.value).toISOString().slice(0, 10) : ''; 
  todoStore.addNewTodo(todoName.value, false, currentDeadline); 
  todoName.value = ''; 
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
  
  if (completedTodos.length === 0) {
    alert("Det finns inga klara Todos att ta bort!");
    return;
  }

  const confirmDelete = confirm(`Du kommer att ta bort ${completedTodos.length}st klara Todos. Vill du fortsätta?`);
  
  if (confirmDelete) {
    const todosToKeep = todos.value.filter(todo => !todo.complete);
    todos.value = todosToKeep;
    todoStore.saveTodosToLocalStorage();
    alert(`${completedTodos.length} klara Todos har tagits bort.`);
  }
}
</script>

<template>
  <main>
    <h1>Mission Possible</h1>
    <h2>Gör dina uppdrag möjliga</h2>

    <div class="input-container">
      <h3>Lägg till en ny task</h3>
      <input type="text" v-model="todoName" @keyup.enter="addTodo" placeholder="Skriv in ett nytt uppdrag här..." />
      <div class="date-and-button-wrapper">
        <div class="date-input-wrapper">
          <label for="deadline">Ange deadline</label>
          <input type="date" id="deadline" v-model="todoDate" />
        </div>
        <button @click="addTodo">Lägg till todo</button>
      </div>
    </div>
   
    <div class="filter-and-button-wrapper">
      <select v-model="filter">
        <option value="Klar">Klara</option>
        <option value="Inte klar">Inte klara</option>
        <option value="Förfallna todos">Förfallna todos</option>
        <option value="Visa alla">Alla todos</option>
      </select>

    <button @click="deleteFinishedTodos">Ta bort klara Todos</button>
  </div>

    <div class="my-task-list">
      <p v-if="showCompletedMessage">Snyggt jobbat med att göra klart en uppgift! 🎉</p>
      <h3>Dina Tasks</h3>
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
    </div>
    
  </main>
</template>

<style>
  body {
    font-family: "Delius", sans-serif;
    background-color: #f3f4f6;
    color: #333;
    margin: 0;
    padding: 0;
  }

  main {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  h1, h2, h3 {
    text-align: center;
    margin: 0;
  }

  h2 {
    font-weight: 300;
    color: #555;
    margin-bottom: 20px;
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
    font-size: 14px;
  }

  .input-container input:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
  }

  button {
    padding: 10px 20px;
    background-color: #2563eb;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
  }

  button:hover {
    background-color: #1d4ed8;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  }

  .filter-and-button-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .filter-and-button-wrapper select {
    width: 48%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
  }

  ul, li {
      margin: 10px 0;
      padding: 0;
      list-style: none;
  }
</style>