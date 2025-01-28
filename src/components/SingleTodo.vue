<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTodosStore } from '@/stores/todos.ts'; 

const props = defineProps({
  id: { type: Number, required: true },
  todoText: { type: String, required: true },
  complete: { type: Boolean, default: false },
  deadline: { type: String, required: true },
});

const emit = defineEmits(['taskCompleted', 'removeTodo']); 

const todoStore = useTodosStore();

const isDone = ref(props.complete);

const formattedDeadline = computed(() => {
  if (props.deadline) {
    const date = new Date(props.deadline);
    return date.toISOString().slice(0, 10);
  }
  return '';
});

const isOverdue = computed(() => {
  const deadlineDate = new Date(props.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  return !props.complete && deadlineDate < today;
});

function toggleCompletedState() {
  isDone.value = !isDone.value;
  emit('taskCompleted'); 
  todoStore.toggleTodoState(props.id, isDone.value);
}

function removeObjectFromList() {
  emit('removeTodo', props.id);
}
</script>

<template>
  <article :class="{ completed: isDone, overdue: isOverdue }" class="todo-item">
    <header>
      <h3>{{ todoText }}</h3>
    </header>

    <section class="deadline-container">
      <p>Deadline: {{ formattedDeadline }}</p>
      <p v-if="isOverdue" class="overdue-icon">⚠️<span class="overdue-text">Förfallen!</span></p>
    </section>

    <section class="buttons">
      <button @click="toggleCompletedState">
        <span v-if="isDone">Avmarkera som klar</span>
        <span v-if="!isDone">Markera som klar</span>
      </button>
      <button @click="removeObjectFromList">Ta bort</button>
    </section>
  </article>
</template>

<style scoped>
  /* Styling för todo-item */
  .todo-item {
    margin: 10px 0;
    text-align: center;
    background-color: #f9f9f9;
    padding: 10px;
    border: 2px solid #d1d5db;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Styling för deadline-container */
  .todo-item .deadline-container {
    display: inline-flex;
    align-items: center;
  }

  /* Rubrik-styling */
  h3 {
    margin: 10px 0 0 0;
    font-size: 1.2em;
    color: #374151;
  }

  /* Överstigna todos (förfallna uppgifter) */
  .overdue h3 {
    color: #ef4444;
    font-weight: bold;
  }

  .overdue-icon {
    display: inline-block;
    position: relative;
    margin-left: 5px;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
  }

  .overdue-text {
    font-size: 14px;
    color: #ef4444;
    visibility: hidden;
    position: absolute;
    left: 40px;
    top: 5px;
    background: #fff;
    padding: 5px;
    border: 1px solid #ef4444;
    border-radius: 5px;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .overdue-icon:hover .overdue-text {
    visibility: visible;
  }

  /* Slutförda todos */
  .completed h3 {
    text-decoration: line-through;
    color: #374151;
  }

  /* Styling för knappar */
  .buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
  }

  /* Styling för paragraf */
  p {
    margin-top: 15px;
    font-size: 1em;
    color: #6b7280;
  }
</style>
