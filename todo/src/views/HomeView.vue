<script setup lang="ts">
import { ref, computed } from 'vue';
import SingleTodo from '@/components/SingleTodo.vue';
import { useTodosStore } from '@/stores/todos.ts'; 
import { storeToRefs } from 'pinia'; 

const todoStore = useTodosStore(); 
const { todos } = storeToRefs(todoStore); 
const todoName = ref('');

const showCompletedMessage = ref(false); 

const today = computed(() => {
  return new Date().toISOString().slice(0, 10);
});

const todoDate = ref(today.value);

function addTodo() {
  if (todoName.value.trim() === '') return; 

  // Formatera datumet som en ISO-sträng
  const currentDeadline = todoDate.value ? new Date(todoDate.value).toISOString().slice(0, 10) : ''; 

  todoStore.addNewTodo(todoName.value, false, currentDeadline); 
  todoName.value = ''; 
  //todoStore.addNewTodo(todoName.value, false); 
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
</script>

<template>
  <main>
    <h1>Mission Possible</h1>
    <h2>Gör dina uppdrag möjliga</h2>
    <div class="my-8">

     <p v-if="showCompletedMessage">Snyggt jobbat med att göra klart en uppgift!</p>

      <div v-if="todos.length > 0" v-for="(todo, index) in todos" :key="index">
        <SingleTodo 
          :todo-text="todo.text" 
          :complete="todo.complete" 
          :id="todo.id" 
          :deadline="todo.deadline"
          @task-completed="onTaskCompleted" 
          @remove-todo="removeTodoFromList" 
        />
      </div>

      <p v-if="todos.length === 0">Du är klar med alla uppgifter!</p>

    </div>
    <input type="text" v-model="todoName" @keyup.enter="addTodo" />
    <input type="date" v-model="todoDate" />
    <button @click="addTodo">Lägg till todo</button>
  </main>
</template>

<style>
  body {
  font-family: "Delius", serif;
  }

  nav {
    margin-bottom: 30px;
    text-align: center;
    color: black; 
    font-weight: bold;
  }

  main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  }

  h1, h2  {
    text-align: center; 
    margin-top: 0;
    margin-bottom: 0;
  }
  
  nav a {
    margin: 20px;
  }

  input {
    height: 30px;
  }

</style>