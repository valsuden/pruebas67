/**
 * ============================================================================
 * MÓDULO INDEPENDIENTE DE NOTAS - Arcanis: Trials of Mastery
 * 
 * ⚠️ ATENCIÓN: NO CAMBIAR NI ELIMINAR ESTE MÓDULO. ES UNA FUNCIÓN 
 * INTER-GOOGLE UNIVERSAL PARA TODOS LOS GRADOS DEL COLEGIO.
 * ============================================================================
 */

const NotesSystem = {
    cache: null,
    isOpen: false,
    isInitialized: false,

    init: function () {
        // Evitar inicializar más de una vez
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        this.bindEvents();
    },

    bindEvents: function () {
        const notesBtn = document.getElementById('btn-notas');
        if (notesBtn) {
            // Eliminar event listeners anteriores para evitar duplicados
            const newBtn = notesBtn.cloneNode(true);
            notesBtn.parentNode.replaceChild(newBtn, notesBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar propagación
                this.toggleModal();
            });
        }

        const closeBtn = document.getElementById('notes-close-btn');
        if (closeBtn) {
            const newClose = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newClose, closeBtn);
            
            newClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Cerrar al hacer clic fuera del modal (en el overlay)
        const overlay = document.getElementById('notes-overlay');
        if (overlay) {
            const newOverlay = overlay.cloneNode(true);
            overlay.parentNode.replaceChild(newOverlay, overlay);
            
            newOverlay.addEventListener('click', (e) => {
                if (e.target === newOverlay) {
                    this.closeModal();
                }
            });
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
        if (this.isOpen) return; // Evitar abrir si ya está abierto
        
        this.isOpen = true;
        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        if (modal && overlay) {
            modal.style.display = 'flex';
            overlay.style.display = 'block';

            setTimeout(() => {
                modal.classList.add('open');
                overlay.classList.add('open');
            }, 10);

            this.loadNotes();
        }
    },

    closeModal: function () {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        if (modal && overlay) {
            modal.classList.remove('open');
            overlay.classList.remove('open');

            setTimeout(() => {
                modal.style.display = 'none';
                overlay.style.display = 'none';
            }, 300);
        }
    },

    loadNotes: function () {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        if (this.cache !== null) {
            this.renderNotes(this.cache);
            return;
        }

        container.innerHTML = '<div class="notes-loading">Cargando notas...</div>';

        const apiUrl = window.CONFIG && window.CONFIG.NOTES_API_URL ? window.CONFIG.NOTES_API_URL : null;

        if (!apiUrl) {
            container.innerHTML = '<div class="notes-error">⚠️ Faltan configurar NOTES_API_URL en config.js</div>';
            return;
        }

        const cbName = 'notesCb_' + Date.now();

        window[cbName] = (data) => {
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();

            if (!data || !data.success) {
                container.innerHTML = `<div class="notes-error">❌ Error al cargar notas: ${data ? data.error : 'Sin respuesta'}</div>`;
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
            container.innerHTML = '<div class="notes-error">❌ Error de red al contactar con el servidor.</div>';
        };

        document.body.appendChild(script);
    },

    renderNotes: function (notesList) {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        container.innerHTML = '';

        if (notesList.length === 0) {
            container.innerHTML = '<div class="notes-empty">No hay notas publicadas aún.</div>';
            return;
        }

        notesList.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const header = document.createElement('div');
            header.className = 'note-header';
            header.innerHTML = `
                <span class="note-title">${this.escapeHtml(note.titulo)}</span>
                <span class="note-icon">▼</span>
            `;

            const body = document.createElement('div');
            body.className = 'note-body';

            const formattedContent = this.escapeHtml(note.contenido).replace(/\n/g, '<br>');

            body.innerHTML = `
                <div class="note-content">${formattedContent}</div>
                <div class="note-meta">
                    <span class="note-author">Escrito por: ${this.escapeHtml(note.autor)}</span>
                    <span class="note-date">${this.escapeHtml(note.fecha)}</span>
                </div>
            `;

            header.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCard(card, body);
            });

            card.appendChild(header);
            card.appendChild(body);
            container.appendChild(card);
        });
    },

    toggleCard: function (card, body) {
        const isExpanded = card.classList.contains('expanded');

        document.querySelectorAll('.note-card.expanded').forEach(c => {
            c.classList.remove('expanded');
        });

        if (!isExpanded) {
            card.classList.add('expanded');
        }
    },

    escapeHtml: function (s) {
        if (!s) return '';
        return String(s).replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m];
        });
    }
};

// Inicializar cuando el DOM esté listo (solo una vez)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    NotesSystem.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        NotesSystem.init();
    });
}
