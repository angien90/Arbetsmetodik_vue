<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Hem</RouterLink>
        <RouterLink to="/todo-list">Avklarade</RouterLink>
        <RouterLink to="/about">Om appen</RouterLink>
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
    gap: 0;
    width: 100vw; 
    margin-bottom: 0 30px;
    color: black;
    font-weight: bold;
    white-space: nowrap;
  }

  nav a { 
    padding: 10px 15px;
    color: black;
    text-decoration: none;
    transition: color 0.3s ease;
    display: inline-block;
  }

  nav a:hover {
    font-size: 1.2rem;
    text-decoration: underline;
  }
</style> 
