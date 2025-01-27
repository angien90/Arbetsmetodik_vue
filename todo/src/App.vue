<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Hem</RouterLink>
        <RouterLink to="/about">Om appen</RouterLink>
        <RouterLink to="/todo-list">Avklarade</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
  nav {
    display: flex;
    justify-content: center; 
    align-items: center;
    width: 100%;
    margin-bottom: 30px;
    color: black;
    font-weight: bold;
  }

  nav a {
    margin: 10px 20px; 
    color: black;
    text-decoration: none; 
    transition: color 0.3s ease; 
  }

  nav a:hover {
    font-size: 1.2rem;
   text-decoration: underline;
  }
</style> 
