const newTaskInput = document.getElementById('new-task');
const priorityButtons = document.querySelectorAll('.priority-btn');
const taskList = document.getElementById('task-list');

let tasks = [];

// Cargar tareas guardadas
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});

priorityButtons.forEach(button => {
    button.addEventListener('click', () => addTask(button.dataset.priority));
});

function addTask(priority) {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const task = { text: taskText, priority: priority };
        tasks.push(task);
        saveTasks();
        renderTasks();
        newTaskInput.value = '';
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.priority = task.priority;
        li.innerHTML = `
            ${task.text}
            <button class="delete-btn" onclick="deleteTask(${index})">X</button>
        `;
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function getPriorityValue(priority) {
    switch (priority) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
