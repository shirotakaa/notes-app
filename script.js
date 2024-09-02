class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const body = this.getAttribute('body');
        const createdAt = this.getAttribute('createdAt');

        this.shadowRoot.innerHTML = `
        <div class="note-item">
          <h5>${title}</h5>
          <p>${body}</p>
          <small>${new Date(createdAt).toLocaleDateString()}</small>
        </div>
      `;
    }
}

customElements.define('note-item', NoteItem);

const notesContainer = document.getElementById('notesContainer');

function renderNotes(notes) {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('note-item');
        noteElement.setAttribute('title', note.title);
        noteElement.setAttribute('body', note.body);
        noteElement.setAttribute('createdAt', note.createdAt);
        notesContainer.appendChild(noteElement);
    });
}

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

    // Close the modal using the Bootstrap Modal instance
    const noteModal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
    noteModal.hide();

    // Wait for the modal to close, then scroll to the new note
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
