const API_URL = "http://localhost:3000/todos";
let tasks = [];
let customLists = ["Default", "Personal", "Shopping", "Work"];
let editId = null;
let taskToDeleteId = null;
let isSearching = false;

let currentCalDate = new Date();
let selectedDate = new Date();
let dateIsSet = false;

async function loadTasks() {
    try {
        const res = await fetch(API_URL);
        tasks = await res.json();
        renderTasks();
    } catch (e) { console.error(e); }
}

function renderTasks() {
    if (isSearching) return;
    const filter = document.getElementById('mainTitle').innerText;
    let filtered = tasks;

    if (filter === "Finished") {
        filtered = tasks.filter(t => t.finished);
    } else if (filter !== "All Lists") {
        filtered = tasks.filter(t => t.cat === filter && !t.finished);
    } else {
        filtered = tasks.filter(t => !t.finished);
    }
    renderTaskList(filtered);
}

function renderTaskList(list) {
    const container = document.getElementById('taskDisplay');
    container.innerHTML = "";
    list.forEach(t => {
        container.innerHTML += `
          <div class="task-item ${t.finished ? 'completed' : ''}">
            <input type="checkbox" ${t.finished ? 'checked' : ''} onclick="toggleFinished('${t.id}')">
            <div class="task-info">
              <span class="task-title">${t.desc}</span>
              <span class="task-meta">
                ${t.longDesc ? t.longDesc + '<br>' : ''}
                📂 ${t.cat} • 📆 ${t.date || 'No date'}
              </span>
            </div>
            <div class="task-actions">
              <span class="action-icon" onclick="editTask('${t.id}')">✏️</span>
              <span class="action-icon" onclick="prepareDelete('${t.id}')">🗑️</span>
            </div>
          </div>`;
    });
}

function editTask(id) {
    const task = tasks.find(t => t.id == id);
    if (!task) return;
    editId = id;
    document.getElementById('taskDesc').value = task.desc;
    document.getElementById('taskLongDesc').value = task.longDesc || "";
    document.getElementById('taskCategory').value = task.cat;
    document.getElementById('taskDateDisplay').value = task.date || "";
    document.getElementById('taskDate').value = task.date || "";
    document.getElementById('screenTitle').innerText = "Edit Task";
    document.getElementById('newTaskScreen').style.display = 'block';
}

document.getElementById('saveTaskBtn').onclick = async () => {
    const desc = document.getElementById('taskDesc').value.trim();
    if (!desc) return;
    const data = {
        desc,
        longDesc: document.getElementById('taskLongDesc').value,
        cat: document.getElementById('taskCategory').value,
        date: document.getElementById('taskDate').value || "No date",
        finished: false
    };

    if (editId) {
        await fetch(`${API_URL}/${editId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
    editId = null;
    document.getElementById('newTaskScreen').style.display = 'none';
    loadTasks();
};

function prepareDelete(id) {
    taskToDeleteId = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('confirmDeleteBtn').onclick = async () => {
    if (taskToDeleteId) {
        await fetch(`${API_URL}/${taskToDeleteId}`, { method: 'DELETE' });
        closeDeleteModal();
        loadTasks();
    }
};

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    taskToDeleteId = null;
}

async function toggleFinished(id) {
    const task = tasks.find(t => t.id == id);
    const newFinishedStatus = !task.finished;
    await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finished: newFinishedStatus })
    });
    loadTasks();
}

function resetHeader() {
    isSearching = false;
    document.getElementById('headerNormalView').style.display = 'flex';
    document.getElementById('searchTrigger').style.display = 'block';
    document.getElementById('searchContainer').style.display = 'none';
    document.getElementById('newListContainer').style.display = 'none';
    renderTasks();
}
function enableSearchMode() {
    document.getElementById('headerNormalView').style.display = 'none';
    document.getElementById('searchTrigger').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'flex';
    isSearching = true;
}
function enableNewListMode() {
    document.getElementById('todoMenu').classList.remove('show');
    document.getElementById('headerNormalView').style.display = 'none';
    document.getElementById('newListContainer').style.display = 'flex';
}
function handleNewListKey(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim();
        if (val && !customLists.includes(val)) {
            customLists.push(val);
            updateListUI();
            resetHeader();
        }
    }
}
function runLiveSearch() {
    const q = document.getElementById('headerSearchInput').value.toLowerCase();
    const filtered = tasks.filter(t => t.desc.toLowerCase().includes(q));
    renderTaskList(filtered);
}

function openCalendar() { currentCalDate = new Date(); renderCalendar(); document.getElementById('calendarModal').style.display = 'flex'; }
function closeCalendar() { document.getElementById('calendarModal').style.display = 'none'; }
function changeMonth(dir) { currentCalDate.setMonth(currentCalDate.getMonth() + dir); renderCalendar(); }
function renderCalendar() {
    const grid = document.getElementById('calGrid');
    grid.innerHTML = "";
    const month = currentCalDate.getMonth();
    const year = currentCalDate.getFullYear();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calMonthTitle').innerText = `${months[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay === 0 ? 6 : firstDay - 1);
    for (let i = 0; i < offset; i++) grid.innerHTML += `<div></div>`;
    for (let i = 1; i <= daysInMonth; i++) {
        grid.innerHTML += `<div class="day-num" onclick="selectDay(${i})">${i}</div>`;
    }
}
function selectDay(d) {
    selectedDate = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth(), d);
    dateIsSet = true;
    document.getElementById('calDateHeader').innerText = selectedDate.toDateString();
}
function confirmDate() {
    if (dateIsSet) {
        document.getElementById('taskDateDisplay').value = selectedDate.toDateString();
        document.getElementById('taskDate').value = selectedDate.toISOString().split('T')[0];
    }
    closeCalendar();
}

function toggleMenu(e) { e.stopPropagation(); document.getElementById('todoMenu').classList.toggle('show'); }
function selectList(el) {
    document.getElementById('mainTitle').innerText = el.getAttribute('data-name');
    document.getElementById('todoMenu').classList.remove('show');
    renderTasks();
}

document.getElementById('openPlusBtn').onclick = () => {
    editId = null;
    document.getElementById('taskDesc').value = "";
    document.getElementById('taskLongDesc').value = "";
    document.getElementById('taskDateDisplay').value = "";
    document.getElementById('taskDate').value = "";
    document.getElementById('screenTitle').innerText = "New Task";
    document.getElementById('newTaskScreen').style.display = 'block';
};

document.getElementById('closeBtn').onclick = () => document.getElementById('newTaskScreen').style.display = 'none';

document.getElementById('quickInput').onkeypress = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ desc: e.target.value, cat: "Default", finished: false, date: "No date" })
        });
        e.target.value = "";
        loadTasks();
    }
};

function updateListUI() {
    document.getElementById('dynamicLists').innerHTML = customLists.map(l =>
        `<li class="custom-list-item" onclick="selectList(this)" data-name="${l}"><i class="fa fa-list-ul"></i> ${l}</li>`
    ).join('');
    document.getElementById('taskCategory').innerHTML = customLists.map(l =>
        `<option value="${l}">${l}</option>`
    ).join('');
}

window.onclick = () => document.getElementById('todoMenu').classList.remove('show');

updateListUI();
loadTasks();