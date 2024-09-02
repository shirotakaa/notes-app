// Dummy notes data
const notesData = [
    {
        id: 'notes-jT-jjsyz61J8XKiI',
        title: 'Welcome to Notes, Dimas!',
        body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.',
        createdAt: '2022-07-28T10:03:12.594Z',
        archived: false,
    },
    {
        id: 'notes-1234-abcd-5678',
        title: 'Language Learning',
        body: 'Practice Spanish vocabulary for 30 minutes every day.',
        createdAt: '2022-10-28T08:00:20.120Z',
        archived: false,
    },
];

// Define custom elements
class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['bgcolor', 'textcolor'];
    }

    attributeChangedCallback() {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div class="card" style="background-color: ${this.getAttribute('bgcolor') || '#fff555   '};">
                <div class="card-body" style="color: ${this.getAttribute('textcolor') || '#333'};">
                    <h5 class="card-title">${this.getAttribute('title')}</h5>
                    <p class="card-text">${this.getAttribute('body')}</p>
                    <p class="card-text"><small class="text-muted">${this.getAttribute('createdAt')}</small></p>
                </div>
            </div>
        `;
    }
}

customElements.define('note-item', NoteItem);

class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <nav class="navbar navbar-light bg-light mb-4">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">Notes App</span>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-bar', AppBar);

// Function to render notes
function renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';

    notesData.forEach(note => {
        const noteElement = document.createElement('note-item');
        noteElement.setAttribute('title', note.title);
        noteElement.setAttribute('body', note.body);
        noteElement.setAttribute('createdAt', new Date(note.createdAt).toLocaleDateString());
        notesContainer.appendChild(noteElement);
    });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('note-title').value;
    const body = document.getElementById('note-body').value;

    const newNote = {
        id: `notes-${Math.random().toString(36).substr(2, 9)}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
    };

    notesData.push(newNote);
    renderNotes();
    document.getElementById('note-form').reset();
}

// Handle real-time validation
function handleRealTimeValidation() {
    const titleInput = document.getElementById('note-title');
    const bodyInput = document.getElementById('note-body');

    titleInput.addEventListener('input', function() {
        titleInput.classList.toggle('is-invalid', titleInput.value.trim() === '');
    });

    bodyInput.addEventListener('input', function() {
        bodyInput.classList.toggle('is-invalid', bodyInput.value.trim() === '');
    });
}

// Initialize app
function initApp() {
    renderNotes();
    handleRealTimeValidation();
    document.getElementById('note-form').addEventListener('submit', handleFormSubmit);
}

// Run the app
initApp();
