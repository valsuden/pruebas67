
const SecretFeatures = {
    unlockMiHistoria() {
        if (!document.getElementById('mi-historia-modal')) {
            this.buildModal();
        }
        this.openModal();
    },

    buildModal() {
        const modal = document.createElement('div');
        modal.id = 'mi-historia-modal';
        modal.className = 'modal-overlay';

        let tabsHtml = '<div class="historia-tabs">';
        let contentHtml = '<div class="historia-tab-content-container">';

        if (typeof MI_HISTORIA_CONTENT !== 'undefined' && MI_HISTORIA_CONTENT.categories) {
            MI_HISTORIA_CONTENT.categories.forEach((category, index) => {
                const isActive = index === 0 ? 'active' : '';
                tabsHtml += `<button class="historia-tab-btn ${isActive}" data-target="historia-cat-${category.id}">${category.title}</button>`;
                
                contentHtml += `<div class="historia-tab-content ${isActive}" id="historia-cat-${category.id}">`;
                if (category.sections) {
                    category.sections.forEach(sec => {
                        if (sec.type === 'heading') {
                            contentHtml += `<h4 class="historia-heading">${sec.text}</h4>`;
                        } else if (sec.type === 'paragraph') {
                            // Bold text matching
                            let text = sec.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            contentHtml += `<p class="historia-paragraph">${text}</p>`;
                        } else if (sec.type === 'image') {
                            contentHtml += `<img src="${sec.url}" alt="${sec.alt || ''}" style="max-width:100%; border-radius:5px; margin: 10px 0; border: 1px solid #00f3ff;" />`;
                        }
                    });
                }
                contentHtml += `</div>`;
            });
        }
        
        tabsHtml += '</div>';
        contentHtml += '</div>';

        modal.innerHTML = `
            <div class="modal-content mi-historia-content">
                <div class="modal-header">
                    <h2>${typeof MI_HISTORIA_CONTENT !== 'undefined' ? MI_HISTORIA_CONTENT.title : 'Mi Historia'}</h2>
                    <button class="close-btn" id="close-mi-historia">&times;</button>
                </div>
                <div class="modal-body" style="overflow-y: auto; text-align: left; padding: 20px;">
                    ${tabsHtml}
                    ${contentHtml}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners for tabs
        const tabBtns = modal.querySelectorAll('.historia-tab-btn');
        const tabContents = modal.querySelectorAll('.historia-tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(btn.getAttribute('data-target')).classList.add('active');
            });
        });

        document.getElementById('close-mi-historia').addEventListener('click', () => {
            this.closeModal();
        });
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'mi-historia-modal') {
                this.closeModal();
            }
        });
    },

    openModal() {
        const modal = document.getElementById('mi-historia-modal');
        if (modal) modal.classList.add('open');
    },

    closeModal() {
        const modal = document.getElementById('mi-historia-modal');
        if (modal) modal.classList.remove('open');
    }
};
