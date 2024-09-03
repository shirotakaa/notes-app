class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}

// card
customElements.define('note-item', NoteItem);

const notesContainer = document.getElementById('notesContainer');

function renderNotes(notes) {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('col');
        noteElement.innerHTML = `
        <div class="card h-100 text-white">
          <div class="card-body">
            <h5 class="card-title">${note.title}</h5>
            <p class="card-text">${note.body}</p>
            <small class="text-date">${new Date(note.createdAt).toLocaleDateString()}</small>
          </div>
          <div class="border-top mb-3"></div>
          <div class="d-flex justify-content-end gap-1 mb-2">
            <button class="btn btn-sm btn-custom edit-note" data-id="${note.id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-sm btn-custom delete-note" data-id="${note.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
        notesContainer.appendChild(noteElement);
    });

    // edit & delete button
    document.querySelectorAll('.edit-note').forEach(button => {
        button.addEventListener('click', handleEditNote);
    });

    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', handleDeleteNote);
    });
}

// delete & sweetalert note
function handleDeleteNote(event) {
    const noteId = event.currentTarget.getAttribute('data-id');

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        background: '#242947',  // Custom background color
        color: '#fff',  // Custom text color
        confirmButtonColor: '#505883',  // Custom confirm button color
        cancelButtonColor: '#dc3545',  // Custom cancel button color
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            notesData = notesData.filter(note => note.id !== noteId);
            localStorage.setItem('notes', JSON.stringify(notesData));
            renderNotes(notesData);
        }
    });
}

// validate form input
function validateForm() {
    const title = document.getElementById('noteTitle');
    const body = document.getElementById('noteBody');
    let isValid = true;

    if (title.value.trim() === '') {
        title.classList.add('is-invalid');
        isValid = false;
    } else {
        title.classList.remove('is-invalid');
    }

    if (body.value.trim() === '') {
        body.classList.add('is-invalid');
        isValid = false;
    } else {
        body.classList.remove('is-invalid');
    }

    return isValid;
}

document.getElementById('noteForm').addEventListener('input', () => {
    validateForm();
});

// add note
document.getElementById('noteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;

    const newNote = {
        id: `notes-${Date.now()}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
    };
    notesData.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notesData));
    renderNotes(notesData);

    // close & scroll modal
    const noteModal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
    noteModal.hide();

    setTimeout(() => {
        const lastNoteElement = notesContainer.lastElementChild;
        lastNoteElement.scrollIntoView({ behavior: 'smooth' });
    }, 300);

    document.getElementById('noteForm').reset();
});

const savedNotes = localStorage.getItem('notes');
if (savedNotes) {
    notesData = JSON.parse(savedNotes);
}

renderNotes(notesData);

let editingNoteId = null;

// edit
function handleEditNote(event) {
    const noteId = event.currentTarget.getAttribute('data-id');
    const note = notesData.find(note => note.id === noteId);

    document.getElementById('editNoteTitle').value = note.title;
    document.getElementById('editNoteBody').value = note.body;

    editingNoteId = noteId;

    const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
    editNoteModal.show();
}

document.getElementById('editNoteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('editNoteTitle').value.trim();
    const body = document.getElementById('editNoteBody').value.trim();

    if (title === '' || body === '') {
        if (title === '') document.getElementById('editNoteTitle').classList.add('is-invalid');
        if (body === '') document.getElementById('editNoteBody').classList.add('is-invalid');
        return;
    }

    // find & update date edit
    const noteIndex = notesData.findIndex(note => note.id === editingNoteId);
    notesData[noteIndex].title = title;
    notesData[noteIndex].body = body;
    notesData[noteIndex].createdAt = new Date().toISOString();

    localStorage.setItem('notes', JSON.stringify(notesData));

    renderNotes(notesData);

    // close modal
    const editNoteModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
    editNoteModal.hide();

    document.getElementById('editNoteForm').reset();
    editingNoteId = null;
});

document.querySelectorAll('.edit-note').forEach(button => {
    button.addEventListener('click', handleEditNote);
});

// year copyright
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    yearSpan.textContent = new Date().getFullYear();
});

// Back to Top button functionality
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
