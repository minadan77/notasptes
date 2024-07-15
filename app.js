document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const priorityCircles = document.querySelectorAll('.priority-circle');

    let selectedPriority = null;

    priorityCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            priorityCircles.forEach(c => c.classList.remove('selected'));
            circle.classList.add('selected');
            selectedPriority = circle.getAttribute('data-priority');
            addTask();
        });
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText && selectedPriority) {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.setAttribute('data-priority', selectedPriority);
            li.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-btn">×</button>
            `;
            li.querySelector('.delete-btn').addEventListener('click', () => {
                li.remove();
                updateTaskOrder();
            });
            taskList.appendChild(li);
            taskInput.value = '';
            selectedPriority = null;
            priorityCircles.forEach(c => c.classList.remove('selected'));
            updateTaskOrder();
        }
    }

    function updateTaskOrder() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.getAttribute('data-priority')] - priorityOrder[b.getAttribute('data-priority')];
        });
        taskList.innerHTML = '';
        tasks.forEach(task => taskList.appendChild(task));
    }
});

// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service worker registered'))
            .catch(err => console.log('Service worker registration failed:', err));
    });
}
