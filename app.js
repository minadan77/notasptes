document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const priorityButtons = document.querySelectorAll('.priority-btn');

    let selectedPriority = null;

    priorityButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPriority = button.dataset.priority;
            addTask();
        });
    });

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText && selectedPriority) {
            const taskItem = createTaskElement(taskText, selectedPriority);
            taskList.appendChild(taskItem);
            newTaskInput.value = '';
            selectedPriority = null;
            saveTasks();
        }
    }

    function createTaskElement(text, priority) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('data-priority', priority);
        
        const taskText = document.createElement('span');
        taskText.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            saveTasks();
        });
        
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        
        return taskItem;
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(taskItem => ({
            text: taskItem.querySelector('span').textContent,
            priority: taskItem.dataset.priority
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text, task.priority);
            taskList.appendChild(taskItem);
        });
    }

    loadTasks();
});
