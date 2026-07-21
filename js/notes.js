/**
 * ============================================================================
 * MÓDULO INDEPENDIENTE DE NOTAS - Arcanis: Trials of Mastery
 * FIX DEFINITIVO: El modal ya no bloquea los demás botones al iniciar.
 * ============================================================================
 */

const NotesSystem = {
    cache: null,
    isOpen: false,

    init: function () {
        // FORZAR estado cerrado al iniciar
        this.forceClosedState();
        this.bindEvents();
    },

    forceClosedState: function () {
        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        this.isOpen = false;

        if (modal) {
            modal.classList.remove('open');
            modal.style.display = 'none';
            modal.style.pointerEvents = 'none';
        }

        if (overlay) {
            overlay.classList.remove('open');
            overlay.style.display = 'none';
            overlay.style.pointerEvents = 'none';
        }
    },

    bindEvents: function () {
        const notesBtn = document.getElementById('btn-notas');
        if (notesBtn) {
            notesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleModal();
            });
        }

        const closeBtn = document.getElementById('notes-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        const overlay = document.getElementById('notes-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }
    },

    toggleModal: function () {
        if (this.isOpen) {
            this.closeModal();
        } else {
            this.openModal();
        }
    },

    openModal: function () {
        this.isOpen = true;

        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        if (!modal || !overlay) return;

        // Activar clics SOLO cuando está abierto
        overlay.style.display = 'block';
        overlay.style.pointerEvents = 'auto';

        modal.style.display = 'flex';
        modal.style.pointerEvents = 'auto';

        requestAnimationFrame(() => {
            overlay.classList.add('open');
            modal.classList.add('open');
        });

        this.loadNotes();
    },

    closeModal: function () {
        this.isOpen = false;

        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        if (!modal || !overlay) return;

        modal.classList.remove('open');
        overlay.classList.remove('open');

        setTimeout(() => {
            // Desactivar completamente los clics
            modal.style.display = 'none';
            modal.style.pointerEvents = 'none';

            overlay.style.display = 'none';
            overlay.style.pointerEvents = 'none';
        }, 300);
    },

    loadNotes: function () {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        // Usar caché si ya se cargó
        if (this.cache !== null) {
            this.renderNotes(this.cache);
            return;
        }

        container.innerHTML = '<div class="notes-loading">Cargando notas...</div>';

        const apiUrl = window.CONFIG?.NOTES_API_URL;

        if (!apiUrl) {
            container.innerHTML = '<div class="notes-error">⚠️ Falta configurar NOTES_API_URL</div>';
            return;
        }

        const cbName = 'notesCb_' + Date.now();

        window[cbName] = (data) => {
            delete window[cbName];
            document.getElementById(cbName)?.remove();

            if (!data || !data.success) {
                container.innerHTML =
                    `<div class="notes-error">❌ Error: ${data?.error || 'Sin respuesta'}</div>`;
                return;
            }

            this.cache = data.notes || [];
            this.renderNotes(this.cache);
        };

        const script = document.createElement('script');
        script.id = cbName;
        script.src = `${apiUrl}?action=getNotes&callback=${cbName}&t=${Date.now()}`;

        script.onerror = () => {
            delete window[cbName];
            script.remove();
            container.innerHTML =
                '<div class="notes-error">❌ Error de red al cargar notas.</div>';
        };

        document.body.appendChild(script);
    },

    renderNotes: function (notesList) {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        container.innerHTML = '';

        if (!notesList.length) {
            container.innerHTML =
                '<div class="notes-empty">No hay notas publicadas aún.</div>';
            return;
        }

        notesList.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const header = document.createElement('div');
            header.className = 'note-header';

            const title = document.createElement('h3');
            title.className = 'note-title';
            title.textContent = note.title || 'Sin título';

            const date = document.createElement('div');
            date.className = 'note-date';
            date.textContent = note.date || '';

            header.appendChild(title);
            header.appendChild(date);

            const content = document.createElement('div');
            content.className = 'note-content';
            content.textContent = note.content || '';

            card.appendChild(header);
            card.appendChild(content);

            container.appendChild(card);
        });
    }
};

// Inicialización segura
document.addEventListener('DOMContentLoaded', () => {
    NotesSystem.init();
});
