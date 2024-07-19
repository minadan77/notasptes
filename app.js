const newTaskInput = document.getElementById('new-task');
const priorityButtons = document.querySelectorAll('.priority-btn');
const taskList = document.getElementById('task-list');

let db;
const DB_NAME = 'TasksDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'tasks';

function openDb() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos', event);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadTasks();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
            db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
    };
}

function addTaskToDb(task) {
    const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.add(task);
    request.onsuccess = () => {
        loadTasks(); // Carga nuevamente las tareas para reflejar el cambio
    };
    transaction.onerror = (event) => {
        console.error('Error al agregar la tarea', event);
    };
}

function loadTasks() {
    const transaction = db.transaction([DB_STORE_NAME], 'readonly');
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
        console.error('Error al cargar las tareas', event);
    };

    request.onsuccess = (event) => {
        tasks = event.target.result;
        renderTasks();
    };
}

function deleteTaskFromDb(id) {
    const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_STORE_NAME);
    store.delete(id);
    transaction.onerror = (event) => {
        console.error('Error al eliminar la tarea', event);
    };
    transaction.oncomplete = () => {
        loadTasks(); // Carga nuevamente las tareas para reflejar el cambio
    };
}

let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    openDb();
});

priorityButtons.forEach(button => {
    button.addEventListener('click', () => addTask(button.dataset.priority));
});

function addTask(priority) {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const task = { text: taskText, priority: priority };
        addTaskToDb(task);
        newTaskInput.value = '';
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id; // Usar el ID para eliminar la tarea
        li.dataset.priority = task.priority;
        li.innerHTML = `
            ${task.text}
            <button class="delete-btn" data-id="${task.id}">X</button>
        `;
        taskList.appendChild(li);
    });

    // Reasignar el manejador de eventos para los botones de eliminación
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id, 10);
            deleteTaskFromDb(id);
        });
    });
}

function getPriorityValue(priority) {
    switch (priority) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
    }
}
