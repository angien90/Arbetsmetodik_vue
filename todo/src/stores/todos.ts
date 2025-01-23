// Nödvändiga importer från ramverket
import { ref, onMounted } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';

// Skapa ett interface som beskriver våra todos, bl.a. för
// att få lite kodhjälp.
// ID ger varje todo:s ett unikt värde då todos kan innehålla samma text 
export interface ITodo { 
    id: number; 
    text: string;
    complete: boolean;
    deadline: string;
  }

const DEBUGGING = import.meta.env.DEV;
const nextId = ref(0); 

// Skapa vårt store med namnet "todos"
export const useTodosStore = defineStore('todos', () => {

  // Denna array bestående av ITodos kommer att innehålla våra todos
  const todos = ref<ITodo[]>([]);

  // Denna funktion hämtar våra lagrade todos från localStorage
  // och sparar dessa i "todos"-variablen som vi definierade här ovan
  function getTodosFromLocalStorage() {
    const savedTodos = localStorage.getItem('todos');

    if (savedTodos === null) {
      if (DEBUGGING) {
        console.warn('Inga todos lagrade i localStorage sedan innan.');
      }
      return;
    }

    // Konvertera från textformat till objekt
    todos.value = JSON.parse(savedTodos);

    // Hitta det högsta id:t bland våra todos för att kunna öka id:t
    nextId.value = Math.max(...todos.value.map(todo => todo.id)); 

    // Skriv ut hjälptext om vi är i utvecklarläge
    if (DEBUGGING) {
      console.log('Följande värden finns lagrade i localStorage');
      console.table(todos.value);
    }
  }

  // Denna funktion konverterar vårt objekt till textformat
  // och sparar det sedan i localStorage
  function saveTodosToLocalStorage() {
    const stringified = JSON.stringify(todos.value);
    localStorage.setItem('todos', stringified);

    if (DEBUGGING) {
      console.log('Sparade följande värden i localStorage');
      console.table(todos.value);
    }
  }

  function addNewTodo(text: string, complete: boolean, deadline: string): void {
    nextId.value += 1; 
    todos.value.push({ text, complete, id: nextId.value, deadline }); 
    saveTodosToLocalStorage();
  }

  function toggleTodoState(id: number, isComplete: boolean): void { 
    const item = todos.value.find(todo => todo.id === id); 
    if (item) { 
      item.complete = isComplete; 
      saveTodosToLocalStorage(); 
    } 
  } 

  // Ta bort en todo baserat på dess id
  function deleteTodo(id: number): void {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.value.splice(index, 1);
      saveTodosToLocalStorage(); // Uppdatera localStorage
    }
  }

  // När programmet laddas första gången så hämtar vi våra todos
  onMounted(() => {
    getTodosFromLocalStorage();
  });

  return { todos, addNewTodo, toggleTodoState, deleteTodo }; 
});

// Används medan vi utvecklar så att ändringar vi skriver i denna fil
// appliceras direkt och vi behöver inte uppdatera webbläsarfönstret
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot));
}