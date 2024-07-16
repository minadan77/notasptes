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
            insertTaskInOrder(taskItem);
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

    function insertTaskInOrder(taskItem) {
        const priority = taskItem.getAttribute('data-priority');
        const tasks = Array.from(taskList.children);
        
        const insertIndex = tasks.findIndex(task => {
            const taskPriority = task.getAttribute('data-priority');
            return getPriorityOrder(priority) < getPriorityOrder(taskPriority);
        });

        if (insertIndex === -1) {
            taskList.appendChild(taskItem);
        } else {
            taskList.insertBefore(taskItem, tasks[insertIndex]);
        }
    }

    function getPriorityOrder(priority) {
        switch(priority) {
            case 'high': return 1;
            case 'medium': return 2;
            case 'low': return 3;
            default: return 4;
        }
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
        tasks.sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text, task.priority);
            taskList.appendChild(taskItem);
        });
    }

    loadTasks();
});
