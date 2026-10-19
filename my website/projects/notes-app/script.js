/* ==========================================
   NOTES APP LOGIC
   ========================================== */

let notes = JSON.parse(localStorage.getItem('faizaNotes')) || [];
let selectedColor = '#ffffff';

const notesGrid = document.getElementById('notesGrid');
const emptyState = document.getElementById('emptyState');

/* ==========================================
   1. SELECT COLOR
   ========================================== */
function selectColor(el, color) {
  document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
  el.classList.add('active');
  selectedColor = color;
  document.querySelector('.note-creator').style.background = color;
}

/* ==========================================
   2. ADD NOTE
   ========================================== */
function addNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const body = document.getElementById('noteBody').value.trim();

  if (!title && !body) {
    showToast("Please write something in the note!", true);
    return;
  }

  const newNote = {
    id: Date.now().toString(),
    title: title,
    body: body,
    color: selectedColor,
    pinned: false,
    date: new Date().toLocaleDateString()
  };

  notes.unshift(newNote); // Add to top
  saveNotes();
  renderNotes();

  // Reset Form
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteBody').value = '';
  selectedColor = '#ffffff';
  document.querySelector('.note-creator').style.background = '#ffffff';
  document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
  document.querySelector('.color-dot').classList.add('active');

  showToast("Note added successfully!");
}

/* ==========================================
   3. RENDER NOTES
   ========================================== */
function renderNotes(filterText = '') {
  notesGrid.innerHTML = '';

  // Filter notes based on search
  let filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(filterText.toLowerCase()) || 
    note.body.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  // Sort notes: Pinned notes first, then by date
  filteredNotes.sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  filteredNotes.forEach(note => {
    const div = document.createElement('div');
    div.className = `note-card ${note.pinned ? 'pinned' : ''}`;
    div.style.backgroundColor = note.color;
    
    div.innerHTML = `
      <h3>${note.title || 'Untitled'}</h3>
      <p>${note.body}</p>
      
      <div class="note-actions">
        <button class="note-btn ${note.pinned ? 'pin-active' : ''}" onclick="togglePin('${note.id}')" title="Pin Note">
          <i class="fas fa-thumbtack"></i>
        </button>
        <button class="note-btn delete" onclick="deleteNote('${note.id}')" title="Delete Note">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    notesGrid.appendChild(div);
  });
}

/* ==========================================
   4. DELETE NOTE
   ========================================== */
function deleteNote(id) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes(document.getElementById('searchInput').value);
    showToast("Note deleted!", true);
  }
}

/* ==========================================
   5. TOGGLE PIN
   ========================================== */
function togglePin(id) {
  notes = notes.map(note => {
    if (note.id === id) {
      return { ...note, pinned: !note.pinned };
    }
    return note;
  });
  saveNotes();
  renderNotes(document.getElementById('searchInput').value);
}

/* ==========================================
   6. SEARCH NOTES
   ========================================== */
function searchNotes() {
  const query = document.getElementById('searchInput').value;
  renderNotes(query);
}

/* ==========================================
   7. SAVE TO LOCAL STORAGE
   ========================================== */
function saveNotes() {
  localStorage.setItem('faizaNotes', JSON.stringify(notes));
}

/* ==========================================
   8. TOAST
   ========================================== */
let toastTimeout;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isError ? '#ef4444' : '#10b981';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ==========================================
   INITIALIZE
   ========================================== */
renderNotes();