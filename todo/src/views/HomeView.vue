<script setup lang="ts">
import { ref } from 'vue';
import SingleTodo from '@/components/SingleTodo.vue';
import { useTodosStore } from '@/stores/todos.ts'; 
import { storeToRefs } from 'pinia'; 

const todoStore = useTodosStore(); 
const { todos } = storeToRefs(todoStore); 
const todoName = ref('');

const showCompletedMessage = ref(false); 

function addTodo() {
  if (todoName.value.trim() === '') return; // Kontrollera tomma uppgifter
  todoStore.addNewTodo(todoName.value, false); 
  todoName.value = ''; // Töm input-fältet efter tillägg
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
          @task-completed="onTaskCompleted" 
          @remove-todo="removeTodoFromList" 
        />
      </div>

      <p v-if="todos.length === 0">Du är klar med alla uppgifter!</p>

    </div>
    <input type="text" v-model="todoName" @keyup.enter="addTodo" />
    <button @click="addTodo">Lägg till todo</button>
  </main>
</template>

<style>
  nav {
    margin-bottom: 30px;
    text-align: center;
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