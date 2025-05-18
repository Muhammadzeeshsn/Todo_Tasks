const form = document.getElementById('task-form');
const tasksList = document.getElementById('tasks');
const filterSelect = document.getElementById('filter');
const searchInput = document.getElementById('search');

let tasks = [];
let editingId = null;

async function loadTasks() {
  const status = filterSelect.value;
  const search = searchInput.value.trim();
  const res = await fetch(`/api/tasks?status=${status}&search=${encodeURIComponent(search)}`);
  tasks = await res.json();
  renderTasks();
}

function renderTasks() {
  tasksList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.innerHTML = `
      <span class="text">${task.text}</span>
      <span>${task.dueDate || '-'}</span>
      <span class="priority-${task.priority}">${task.priority}</span>
      <div class="task-buttons">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    li.querySelector('.text').addEventListener('click', () => toggleComplete(task));
    li.querySelector('.edit').addEventListener('click', () => startEdit(task));
    li.querySelector('.delete').addEventListener('click', () => deleteTask(task._id));

    tasksList.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    text: document.getElementById('task-input').value,
    dueDate: document.getElementById('due-date').value,
    priority: document.getElementById('priority').value
  };
  if (editingId) {
    await fetch(`/api/tasks/${editingId}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
    editingId = null;
  } else {
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(data) });
  }
  form.reset();
  loadTasks();
});

async function toggleComplete(task) {
  await fetch(`/api/tasks/${task._id}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ completed: !task.completed }) });
  loadTasks();
}

function startEdit(task) {
  editingId = task._id;
  document.getElementById('task-input').value = task.text;
  document.getElementById('due-date').value = task.dueDate;
  document.getElementById('priority').value = task.priority;
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

filterSelect.addEventListener('change', loadTasks);
searchInput.addEventListener('input', loadTasks);

loadTasks();