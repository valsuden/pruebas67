// js/inventory.js

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!Users.data || !Users.data.runeQuantities || Object.keys(Users.data.runeQuantities).length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:#aaa; font-size:0.8em; grid-column:1/-1;">Tu inventario está vacío.</p>';
        return;
    }

    const quantities = Users.data.runeQuantities;
    for (let runeId in quantities) {
        if (quantities[runeId] <= 0) continue;
        
        const rune = getRune(runeId);
        if (!rune) continue;

        const rarityInfo = getRuneRarity(rune.rarity);
        const isSecret = rune.rarity === 'Secret';
        const color = rarityInfo.color;
        const glow = rarityInfo.glow;

        const card = document.createElement('div');
        card.style.border = `2px solid ${color}`;
        card.style.borderRadius = '8px';
        card.style.padding = '15px';
        card.style.background = `rgba(0, 0, 0, 0.6)`;
        card.style.boxShadow = `0 0 10px ${glow}`;
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.gap = '10px';
        card.style.position = 'relative';

        // Badge cantidad
        const qtyBadge = document.createElement('div');
        qtyBadge.textContent = 'x' + quantities[runeId];
        qtyBadge.style.position = 'absolute';
        qtyBadge.style.top = '-10px';
        qtyBadge.style.right = '-10px';
        qtyBadge.style.background = '#0055ff';
        qtyBadge.style.color = '#fff';
        qtyBadge.style.padding = '5px 8px';
        qtyBadge.style.borderRadius = '10px';
        qtyBadge.style.fontSize = '0.7em';
        qtyBadge.style.fontWeight = 'bold';
        qtyBadge.style.border = '2px solid #fff';
        card.appendChild(qtyBadge);

        // Ícono / Imagen
        if (rune.imageUrl) {
            const img = document.createElement('img');
            img.src = rune.imageUrl;
            img.style.width = '60px';
            img.style.height = '60px';
            img.style.borderRadius = '8px';
            img.style.border = `2px solid ${color}`;
            card.appendChild(img);
        } else {
            const glyph = document.createElement('div');
            glyph.textContent = rune.glyph || '🔮';
            glyph.style.fontSize = '3em';
            glyph.style.textShadow = `0 0 15px ${glow}`;
            card.appendChild(glyph);
        }

        const title = document.createElement('h3');
        title.textContent = rune.name;
        title.style.margin = '0';
        title.style.fontSize = '0.8em';
        title.style.color = color;
        title.style.textAlign = 'center';
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = rune.description;
        desc.style.margin = '0';
        desc.style.fontSize = '0.6em';
        desc.style.color = '#ccc';
        desc.style.textAlign = 'center';
        card.appendChild(desc);

        const useBtn = document.createElement('button');
        useBtn.textContent = 'USAR';
        useBtn.style.padding = '8px 15px';
        useBtn.style.background = `linear-gradient(135deg, #222, #111)`;
        useBtn.style.border = `2px solid ${color}`;
        useBtn.style.color = color;
        useBtn.style.borderRadius = '5px';
        useBtn.style.cursor = 'pointer';
        useBtn.style.fontFamily = "'Press Start 2P', cursive";
        useBtn.style.fontSize = '0.6em';
        useBtn.style.marginTop = 'auto';

        useBtn.onmouseover = () => {
            useBtn.style.background = color;
            useBtn.style.color = '#000';
            useBtn.style.boxShadow = `0 0 15px ${glow}`;
        };
        useBtn.onmouseout = () => {
            useBtn.style.background = `linear-gradient(135deg, #222, #111)`;
            useBtn.style.color = color;
            useBtn.style.boxShadow = 'none';
        };

        useBtn.onclick = () => {
            if (rune.targeted) {
                window.showTargetSelectionDialog(rune.name, runeId, color, (target) => {
                    window.currentRuneTarget = target;
                    Users.useRune(runeId);
                });
            } else {
                Users.useRune(runeId);
            }
        };

        card.appendChild(useBtn);
        grid.appendChild(card);
    }
}

function showRuneAlert(message, color = '#ffcc00') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.style.background = `rgba(0,0,0,0.9)`;
    toast.style.border = `2px solid ${color}`;
    toast.style.color = color;
    toast.style.padding = '15px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = "'Press Start 2P', cursive";
    toast.style.fontSize = '0.7em';
    toast.style.boxShadow = `0 0 20px ${color}`;
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    toast.style.zIndex = '9999';

    toast.innerHTML = message;
    container.appendChild(toast);

    // Anim intro
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

window.showTargetSelectionDialog = function(runeName, runeId, color, onSelect) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 4000;
        display: flex; justify-content: center; align-items: center;
        font-family: 'Press Start 2P', cursive;
    `;
    
    const panel = document.createElement('div');
    panel.style.cssText = `
        background: #001a33; border: 4px solid ${color}; border-radius: 10px;
        padding: 20px; text-align: center; color: #fff; width: 90%; max-width: 400px;
        box-shadow: 0 0 30px ${color};
    `;
    
    panel.innerHTML = `<h3 style="margin-top:0; color:${color}; font-size:1em; line-height:1.5;">Selecciona objetivo para<br>${runeName}</h3>
    <p style="font-size:0.6em; color:#ff3300; margin-top:5px;">Costo: 100 Arcane Coins</p>`;
    
    const list = document.createElement('div');
    list.style.cssText = `
        max-height: 250px; overflow-y: auto; margin-top: 15px;
        display: flex; flex-direction: column; gap: 8px;
    `;
    list.innerHTML = `<p style="font-size:0.7em; color:#00f3ff; animation: pulse 1.5s infinite;">Cargando jugadores online...</p>`;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'CANCELAR';
    cancelBtn.style.cssText = `
        margin-top: 20px; padding: 10px 15px; background: #ff3300; border: none;
        color: #fff; border-radius: 5px; cursor: pointer; font-family: inherit; font-size: 0.7em;
    `;
    cancelBtn.onclick = () => overlay.remove();
    
    panel.appendChild(list);
    panel.appendChild(cancelBtn);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Fetch live leaderboard
    const currentUser = (typeof Users !== 'undefined' && Users.current) ? Users.current : '';
    const cbName = 'loadTargetsCb_' + Date.now();
    window[cbName] = function(data) {
        delete window[cbName];
        const s = document.getElementById(cbName);
        if (s) s.remove();

        list.innerHTML = '';
        if (!data || !Array.isArray(data)) {
            list.innerHTML = `<p style="font-size:0.7em; color:#ff3300;">Error de conexión.</p>`;
            return;
        }

        let targets = data.filter(p => p.name !== currentUser && (p.score > 0 || (p.streak && p.streak > 0)) );
        if (targets.length === 0) {
            list.innerHTML = `<p style="font-size:0.7em; color:#ccc;">No hay más jugadores online.</p>`;
            return;
        }

        targets.forEach(t => {
            const btn = document.createElement('button');
            btn.innerHTML = `<span>${t.name}</span> <span style="color:#ffdd00; font-size:0.9em;">🏆${t.score} 🔥x${t.streak || 0}</span>`;
            btn.style.cssText = `
                padding: 10px; background: rgba(0,0,0,0.5); border: 2px solid #555;
                color: #fff; border-radius: 5px; cursor: pointer; font-family: inherit; font-size: 0.7em;
                transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;
                width: 100%; box-sizing: border-box;
            `;
            btn.onmouseover = () => { btn.style.background = color; btn.style.color = '#000'; };
            btn.onmouseout = () => { btn.style.background = 'rgba(0,0,0,0.5)'; btn.style.color = '#fff'; };
            btn.onclick = () => {
                overlay.remove();
                onSelect(t.name);
            };
            list.appendChild(btn);
        });
    };

    const script = document.createElement('script');
    script.id = cbName;
    script.src = window.leaderboardAPI + '?action=getLeaderboard&callback=' + cbName + '&t=' + Date.now();
    document.body.appendChild(script);
};

document.addEventListener('DOMContentLoaded', () => {
    const invBtn = document.getElementById('hud-inventory-btn');
    const invOverlay = document.getElementById('inventory-overlay');
    const closeInv = document.getElementById('close-inventory');

    if (invBtn && invOverlay) {
        invBtn.addEventListener('click', () => {
            renderInventory();
            invOverlay.style.display = 'flex';
        });
    }

    if (closeInv && invOverlay) {
        closeInv.addEventListener('click', () => {
            invOverlay.style.display = 'none';
        });
    }
});
