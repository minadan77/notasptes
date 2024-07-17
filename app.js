let db;
const DB_NAME = 'TasksDB';
const STORE_NAME = 'tasks';

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const priorityButtons = document.querySelectorAll('.priority-btn');
    let selectedPriority = null;

    // Inicializar IndexedDB
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
        console.error("Error al abrir la base de datos", event.target.error);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadTasks();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("priority", "priority", { unique: false });
    };

    priorityButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPriority = button.dataset.priority;
            addTask();
        });
    });

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText && selectedPriority) {
            const task = { text: taskText, priority: selectedPriority };
            const transaction = db.transaction([STORE_NAME], "readwrite");
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.add(task);

            request.onsuccess = () => {
                newTaskInput.value = '';
                selectedPriority = null;
                loadTasks();
            };

            request.onerror = (event) => {
                console.error("Error al agregar tarea", event.target.error);
            };
        }
    }

    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('data-priority', task.priority);
        taskItem.setAttribute('data-id', task.id);
        
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        
        return taskItem;
    }

    function deleteTask(id) {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            loadTasks();
        };

        request.onerror = (event) => {
            console.error("Error al eliminar tarea", event.target.error);
        };
    }

    function getPriorityOrder(priority) {
        switch(priority) {
            case 'high': return 1;
            case 'medium': return 2;
            case 'low': return 3;
            default: return 4;
        }
    }

    function loadTasks() {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const tasks = event.target.result;
            taskList.innerHTML = '';
            tasks.sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));
            tasks.forEach(task => {
                const taskItem = createTaskElement(task);
                taskList.appendChild(taskItem);
            });
        };

        request.onerror = (event) => {
            console.error("Error al cargar tareas", event.target.error);
        };
    }
});
