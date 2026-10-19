let tasks = JSON.parse(localStorage.getItem('faizaTasks')) || [];
let currentFilter = 'all';

function saveTasks() { localStorage.setItem('faizaTasks', JSON.stringify(tasks)); }

function updateDate() {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date();
  document.getElementById('dateDisplay').textContent =
    `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function renderTasks() {
  const list = document.getElementById('taskList');
  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  if (filtered.length === 0) {
    const msgs = {
      all: { icon: 'fa-clipboard-list', text: 'No tasks yet. Add your first task above! ✨' },
      active: { icon: 'fa-check-circle', text: 'No active tasks. Great job! 🎉' },
      completed: { icon: 'fa-inbox', text: 'No completed tasks yet.' }
    };
    list.innerHTML = `<div class="empty-state"><i class="fas ${msgs[currentFilter].icon}"></i><p>${msgs[currentFilter].text}</p></div>`;
  } else {
    list.innerHTML = filtered.map(t => `
      <li class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
        <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTask(${t.id})">
          <i class="fas fa-check"></i>
        </div>
        <span class="task-text" onclick="toggleTask(${t.id})">${escapeHtml(t.text)}</span>
        <button class="btn-delete-task" onclick="deleteTask(${t.id})">
          <i class="fas fa-trash"></i>
        </button>
      </li>
    `).join('');
  }

  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${completed} / ${total}`;
  document.getElementById('itemsLeft').textContent =
    `${tasks.filter(t => !t.completed).length} item${tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} left`;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.completed = !task.completed; saveTasks(); renderTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, completed: false });
  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

document.getElementById('clearCompleted').addEventListener('click', () => {
  const completedCount = tasks.filter(t => t.completed).length;
  if (completedCount === 0) { alert('No completed tasks to clear.'); return; }
  if (confirm(`Clear ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  }
});

updateDate();
renderTasks();
