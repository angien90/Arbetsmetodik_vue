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
  return deadlineDate < today;
});

function toggleCompletedState() {
  isDone.value = !isDone.value;
  
  if (isDone.value) { 
    emit('taskCompleted'); 
  } 

  todoStore.toggleTodoState(props.id, isDone.value);
}

function removeObjectFromList() {
  emit('removeTodo', props.id);
}
</script>

<template>
  <div :class="{ completed: isDone, overdue: isOverdue }" class="grid grid-cols-2 gap-2">
    <div>
    <h3>{{ todoText }}</h3>
    <p>Deadline: {{ formattedDeadline }}</p>
    </div>

    <div>
      <button @click="toggleCompletedState">
        <span v-if="isDone">Avmarkera som klar</span>
        <span v-if="!isDone">Markera som klar</span>
      </button>
    </div>
    <div>
      <button @click="removeObjectFromList">Ta bort</button>
    </div>
  </div>
</template>

<style scoped>
  .completed {
    text-decoration: line-through;
  }

  div {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
    background: lightgrey;
  }

  div.grid { 
    border: 2px solid grey;
  }

  .overdue {
    color: red;
  }

</style>