document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('study-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const dueDate = document.getElementById('due-date').value;
    const dueTime = document.getElementById('due-time').value;
    const task = document.getElementById('task').value;

    const taskObject = { subject, dueDate, dueTime, task, id: Date.now() };
    addTaskToLocalStorage(taskObject);
    displayTask(taskObject);
    document.getElementById('study-form').reset();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTask(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.id = task.id;

    const currentTime = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);

    // Check if the due date/time has passed
    if (currentTime >= dueDateTime) {
        li.textContent = `${task.subject} - ${task.task} (Due: ${task.dueDate} ${task.dueTime})`;
        li.classList.add('completed');
    } else {
        li.textContent = `${task.subject} - ${task.task} (Due: ${task.dueDate} ${task.dueTime})`;
    }

    // Add a removal button for completed tasks
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = function() {
        removeTask(task.id);
    };
    li.appendChild(removeButton);
    
    taskList.appendChild(li);

    // Check the due time every minute
    setInterval(() => {
        const currentTime = new Date();
        if (currentTime >= dueDateTime) {
            li.textContent = `${task.subject} - ${task.task} (Due: ${task.dueDate} ${task.dueTime})`;
            li.classList.add('completed');
            li.removeChild(removeButton); // Remove the button once marked as completed
        }
    }, 60000); // Check every minute
}

function removeTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    const taskItem = document.getElementById(id);
    if (taskItem) {
        taskItem.remove();
    }
}
