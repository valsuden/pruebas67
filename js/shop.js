function toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `tom-toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

const Shop = {
    currentRuneStock: [],
    consecutiveMisses: 0,
    lastRefreshTime: 0,

    init() {
        this.loadStock();
        setInterval(() => this.checkRefresh(), 60000);
    },

    loadStock() {
        try {
            const data = JSON.parse(localStorage.getItem('shopRuneStock'));
            if (data && Date.now() - data.time < 600000) {
                this.currentRuneStock = data.stock;
                this.consecutiveMisses = data.misses || 0;
                this.lastRefreshTime = data.time;
            } else {
                this.refreshRuneStock();
            }
        } catch (e) {
            this.refreshRuneStock();
        }
    },

    checkRefresh() {
        if (Date.now() - this.lastRefreshTime >= 600000) {
            this.refreshRuneStock();
            const ov = document.getElementById('shop-overlay');
            if (ov && ov.classList.contains('open')) {
                this.render();
            }
        }
    },

    refreshRuneStock() {
        if (typeof RUNES === 'undefined') return;

        let availableRunes = RUNES.filter(r => r.rarity !== 'Secret');
        let stockSize = 6;
        this.currentRuneStock = [];
        let hasLegendaryOrMythic = false;

        if (this.consecutiveMisses >= 3) {
            let highTierRunes = availableRunes.filter(r => r.rarity === 'Legendary' || r.rarity === 'Mythic');
            if (highTierRunes.length > 0) {
                let guaranteed = highTierRunes[Math.floor(Math.random() * highTierRunes.length)];
                this.currentRuneStock.push(guaranteed);
                hasLegendaryOrMythic = true;
                this.consecutiveMisses = 0;
                stockSize--;
            }
        }

        for (let i = 0; i < stockSize; i++) {
            let randomRune = availableRunes[Math.floor(Math.random() * availableRunes.length)];
            this.currentRuneStock.push(randomRune);
            if (randomRune.rarity === 'Legendary' || randomRune.rarity === 'Mythic') {
                hasLegendaryOrMythic = true;
                this.consecutiveMisses = 0;
            }
        }

        if (!hasLegendaryOrMythic) {
            this.consecutiveMisses++;
        }

        this.lastRefreshTime = Date.now();
        localStorage.setItem('shopRuneStock', JSON.stringify({
            stock: this.currentRuneStock,
            time: this.lastRefreshTime,
            misses: this.consecutiveMisses
        }));
    },

    open() {
        if (!Users.current) { toast('¡Selecciona un usuario primero!', 'error'); return; }
        this.checkRefresh();
        this.render();
        const ov = document.getElementById('shop-overlay');
        if (ov) ov.classList.add('open');
    },
    close() {
        const ov = document.getElementById('shop-overlay');
        if (ov) ov.classList.remove('open');
    },
    render() {
        const grid = document.getElementById('shop-grid');
        if (!grid || !Users.data) return;
        grid.innerHTML = '';

        const bal = document.getElementById('shop-bal');
        if (bal) bal.textContent = Users.data.coins;

        BANNERS.forEach(b => {
            const rows = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
            const isTop1 = rows.length > 0 && rows[0].name === Users.current;
            const isTopBanner = b.id === 'royal_zenith' || b.id === 'celestial_king';
            const owned = (Users.data.ownedBanners || []).includes(b.id) || (isTopBanner && isTop1);
            const equipped = Users.data.equippedBanner === b.id;
            const rar = getRarity(b.rarity);

            const card = document.createElement('div');
            card.className = 'shop-card' + (owned ? ' owned' : '') + (equipped ? ' equipped-card' : '');

            const prev = document.createElement('div');
            prev.className = `card-banner-preview ${b.css}`;
            prev.textContent = b.name;
            card.appendChild(prev);

            const nm = document.createElement('div');
            nm.className = 'card-name';
            nm.textContent = b.name;
            card.appendChild(nm);

            const rt = document.createElement('div');
            rt.className = `card-rarity rarity-tag rarity-${b.rarity}`;
            rt.textContent = b.rarity;
            card.appendChild(rt);

            const pr = document.createElement('div');
            pr.className = 'card-price' + (owned ? ' owned-label' : '');
            pr.textContent = owned ? (equipped ? '✓ EQUIPADO' : '✓ TUYO') : `🪙 ${b.price}`;
            card.appendChild(pr);

            const btn = document.createElement('button');
            btn.className = 'card-btn';
            if (!owned) {
                btn.classList.add('btn-buy');
                btn.textContent = 'COMPRAR';
                btn.onclick = () => this.buy(b.id);
            } else if (equipped) {
                btn.classList.add('btn-unequip');
                btn.textContent = 'DESEQUIPAR';
                btn.onclick = () => { Users.unequipBanner(); this.render(); };
            } else {
                btn.classList.add('btn-equip');
                btn.textContent = 'EQUIPAR';
                btn.onclick = () => { Users.equipBanner(b.id); this.render(); };
            }
            card.appendChild(btn);

            grid.appendChild(card);
        });

        this.renderRunes();
    },
    renderRunes() {
        const runesGrid = document.getElementById('runes-grid');
        if (!runesGrid || !Users.data) return;
        runesGrid.innerHTML = '';

        if (!this.currentRuneStock || this.currentRuneStock.length === 0) return;

        this.currentRuneStock.forEach((r, idx) => {
            const rar = typeof getRuneRarity === 'function' ? getRuneRarity(r.rarity) : null;
            const color = rar ? rar.color : '#fff';

            const card = document.createElement('div');
            card.className = 'shop-card';

            const prev = document.createElement('div');
            prev.className = `card-banner-preview ${r.css}`;
            prev.style.display = 'flex';
            prev.style.justifyContent = 'center';
            prev.style.alignItems = 'center';
            prev.style.fontSize = '2em';
            prev.style.color = color;
            prev.textContent = r.glyph || '?';
            card.appendChild(prev);

            const nm = document.createElement('div');
            nm.className = 'card-name';
            nm.textContent = r.name;
            card.appendChild(nm);

            const desc = document.createElement('div');
            desc.style.fontSize = '0.5em';
            desc.style.color = '#ccc';
            desc.style.marginBottom = '5px';
            desc.style.padding = '0 5px';
            desc.textContent = r.description;
            card.appendChild(desc);

            const rt = document.createElement('div');
            rt.className = `card-rarity rarity-tag rarity-${r.rarity}`;
            rt.textContent = r.rarity;
            card.appendChild(rt);

            const pr = document.createElement('div');
            pr.className = 'card-price';
            pr.textContent = `🪙 ${r.price}`;
            card.appendChild(pr);

            const btn = document.createElement('button');
            btn.className = 'card-btn btn-buy';
            btn.textContent = 'COMPRAR';
            btn.onclick = () => this.buyRune(r.id, idx);
            card.appendChild(btn);

            runesGrid.appendChild(card);
        });

        const secretRune = typeof RUNES !== 'undefined' ? RUNES.find(r => r.id === 'rune_two_time') : null;
        if (secretRune) {
            const rar = typeof getRuneRarity === 'function' ? getRuneRarity(secretRune.rarity) : null;
            const color = rar ? rar.color : '#ff00ff';

            const card = document.createElement('div');
            card.className = 'shop-card out-of-stock';
            card.style.opacity = '0.7';
            card.style.filter = 'grayscale(0.5)';

            const prev = document.createElement('div');
            prev.className = `card-banner-preview ${secretRune.css}`;
            prev.style.display = 'flex';
            prev.style.justifyContent = 'center';
            prev.style.alignItems = 'center';
            prev.style.fontSize = '2em';
            prev.style.color = color;

            if (secretRune.imageUrl) {
                const img = document.createElement('img');
                img.src = secretRune.imageUrl;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                prev.appendChild(img);
            } else {
                prev.textContent = secretRune.glyph || '🌌';
            }

            card.appendChild(prev);

            const nm = document.createElement('div');
            nm.className = 'card-name';
            nm.textContent = secretRune.name;
            card.appendChild(nm);

            const desc = document.createElement('div');
            desc.style.fontSize = '0.5em';
            desc.style.color = '#ccc';
            desc.style.marginBottom = '5px';
            desc.style.padding = '0 5px';
            desc.textContent = secretRune.description;
            card.appendChild(desc);

            const rt = document.createElement('div');
            rt.className = `card-rarity rarity-tag rarity-${secretRune.rarity}`;
            rt.textContent = secretRune.rarity;
            card.appendChild(rt);

            const pr = document.createElement('div');
            pr.className = 'card-price';
            pr.textContent = `🪙 ???`;
            card.appendChild(pr);

            const btn = document.createElement('button');
            btn.className = 'card-btn';
            btn.style.background = '#333';
            btn.style.color = '#888';
            btn.style.cursor = 'not-allowed';
            btn.textContent = 'SIN STOCK';
            card.appendChild(btn);

            runesGrid.appendChild(card);
        }

        if (this.countdownInterval) clearInterval(this.countdownInterval);

        const timerLabel = document.createElement('div');
        timerLabel.style.gridColumn = '1 / -1';
        timerLabel.style.textAlign = 'center';
        timerLabel.style.fontSize = '0.8em';
        timerLabel.style.color = '#ffcc00';
        timerLabel.style.marginTop = '15px';
        runesGrid.appendChild(timerLabel);

        const updateTimer = () => {
            let remaining = (this.lastRefreshTime + 600000) - Date.now();
            if (remaining <= 0) {
                timerLabel.innerHTML = `Restocking...`;
                this.checkRefresh();
                return;
            }
            let mins = Math.floor(remaining / 60000);
            let secs = Math.floor((remaining % 60000) / 1000);
            timerLabel.innerHTML = `Próximo restock: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        updateTimer();
        this.countdownInterval = setInterval(updateTimer, 1000);
    },
    buy(id) {
        const b = getBanner(id);
        if (!b) return;
        if (Users.buyBanner(id)) {
            toast(`¡${b.name} desbloqueado!`, 'success');
            this.render();
        } else {
            toast('Arcane Coins insuficientes', 'error');
        }
    },
    buyRune(id, stockIndex) {
        const r = typeof getRune === 'function' ? getRune(id) : null;
        if (!r) return;
        if (Users.buyRune && Users.buyRune(id)) {
            toast(`¡Runa ${r.name} comprada!`, 'success');
            this.currentRuneStock.splice(stockIndex, 1);
            localStorage.setItem('shopRuneStock', JSON.stringify({
                stock: this.currentRuneStock,
                time: this.lastRefreshTime,
                misses: this.consecutiveMisses
            }));
            this.render();
        } else {
            toast('Arcane Coins insuficientes', 'error');
        }
    },
    redeemCode() {
        const input = document.getElementById('promo-code-input');
        const feedback = document.getElementById('promo-code-feedback');
        if (!input || !feedback) return;

        const enteredCode = input.value.trim().toUpperCase();
        if (!enteredCode) {
            feedback.textContent = '❌ INGRESA UN CÓDIGO';
            feedback.style.color = '#ff3300';
            return;
        }

        const now = Date.now();
        let rateLimit = { attempts: 0, last: 0 };
        try {
            const storedRate = localStorage.getItem('promoRateLimit');
            if (storedRate) rateLimit = JSON.parse(storedRate);
        } catch (e) { }

        if (now - rateLimit.last < 60000) {
            if (rateLimit.attempts >= 5) {
                feedback.textContent = '❌ DEMASIADOS INTENTOS. ESPERA 1 MINUTO.';
                feedback.style.color = '#ff3300';
                return;
            }
        } else {
            rateLimit.attempts = 0;
        }
        rateLimit.attempts++;
        rateLimit.last = now;
        localStorage.setItem('promoRateLimit', JSON.stringify(rateLimit));

        if (!Users.current || !Users.data) {
            feedback.textContent = '❌ ERROR: SELECCIONA UN USUARIO PRIMERO';
            feedback.style.color = '#ff3300';
            return;
        }

        if (!window.leaderboardAPI) {
            feedback.textContent = '❌ ERROR: API no configurada';
            feedback.style.color = '#ff3300';
            return;
        }

        feedback.textContent = '🔄 VALIDANDO EN EL SERVIDOR...';
        feedback.style.color = '#ffff00';

        const hash = window.generateHash ? window.generateHash(Users.current + enteredCode, '', '') : '';
        const cbName = 'redeemCb_' + Date.now();

        window[cbName] = function(data) {
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();

            if (!data) {
                feedback.textContent = '❌ SIN RESPUESTA DEL SERVIDOR';
                feedback.style.color = '#ff3300';
                return;
            }

            if (!data.success) {
                if (data.error && (data.error.includes('Acci') || data.error.includes('no reconocida'))) {
                    feedback.textContent = '⚠️ EL SERVIDOR NO ESTÁ ACTUALIZADO. PIDE AL ADMIN QUE REPUBLIQUE EL SCRIPT.';
                    feedback.style.color = '#ffaa00';
                } else {
                    feedback.textContent = '❌ ' + data.error;
                    feedback.style.color = '#ff3300';
                }
                return;
            }

            const prizeCoins = data.coins || 0;
            if (prizeCoins > 0) Users.addCoins(prizeCoins);

            if (data.runeId) {
                Users.data.ownedRunes = Users.data.ownedRunes || [];
                if (!Users.data.ownedRunes.includes(data.runeId)) Users.data.ownedRunes.push(data.runeId);
                Users.data.runeQuantities = Users.data.runeQuantities || {};
                Users.data.runeQuantities[data.runeId] = (Users.data.runeQuantities[data.runeId] || 0) + 1;
            }

            Users.data.redeemedCodes = Users.data.redeemedCodes || [];
            crypto.subtle.digest('SHA-256', new TextEncoder().encode(enteredCode)).then(buffer => {
                const hashHex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                if (!Users.data.redeemedCodes.includes(hashHex)) Users.data.redeemedCodes.push(hashHex);
                Users.save();

                const bal = document.getElementById('shop-bal');
                if (bal) bal.textContent = Users.data.coins;

                if (data.runeId) {
                    const r = typeof getRune === 'function' ? getRune(data.runeId) : null;
                    const rName = r ? r.name : 'Runa Especial';
                    feedback.textContent = `✅ ¡CÓDIGO CANJEADO! +${prizeCoins > 0 ? prizeCoins + ' Coins & ' : ''}${rName}`;
                    if (typeof toast === 'function') toast(`¡Recibiste ${rName}!`, 'success');
                } else {
                    feedback.textContent = `✅ ¡CÓDIGO CANJEADO! +${prizeCoins} COINS`;
                    if (typeof toast === 'function') toast(`¡Recibiste ${prizeCoins} Arcane Coins!`, 'success');
                }
                feedback.style.color = '#00ff4c';
                input.value = '';
                if (typeof Users._updateHUD === 'function') Users._updateHUD();
            });
        };

        const s = document.createElement('script');
        s.id = cbName;
        s.src = window.leaderboardAPI + '?action=redeemCode&code=' + encodeURIComponent(enteredCode)
            + '&player=' + encodeURIComponent(Users.current)
            + '&hash=' + hash
            + '&callback=' + cbName
            + '&t=' + Date.now();

        s.onerror = () => {
            if (window[cbName]) delete window[cbName];
            s.remove();
            feedback.textContent = '❌ ERROR DE RED. VERIFICA TU CONEXIÓN.';
            feedback.style.color = '#ff3300';
        };

        document.body.appendChild(s);
    }
}

const LB = {
    open() {
        this.render();
        const ov = document.getElementById('lb-overlay');
        if (ov) ov.classList.add('open');
    },
    close() {
        const ov = document.getElementById('lb-overlay');
        if (ov) ov.classList.remove('open');
    },
    render() {
        const list = document.getElementById('lb-list');
        if (!list) return;
        list.innerHTML = '';

        const rows = Storage.getLeaderboard().filter(r => r.score > 0);
        if (rows.length === 0) {
            list.innerHTML = '<p style="font-size:0.7em;color:#aaa;text-align:center;padding:30px 10px">¡Aún no hay puntajes locales!<br><br>Juega una partida y aparece aquí.</p>';
            return;
        }

        const medals = ['🥇', '🥈', '🥉'];
        rows.slice(0, 20).forEach((r, i) => {
            const row = document.createElement('div');
            row.className = 'lb-row' + (i === 0 ? ' rank-1' : '');

            const rank = document.createElement('span');
            rank.className = 'lb-rank';
            rank.textContent = medals[i] || `#${i + 1}`;
            row.appendChild(rank);

            const name = document.createElement('span');
            name.className = 'lb-name';
            if (i === 0) {
                name.classList.add('top1-aura');
                const crownHtml = document.createElement('span');
                crownHtml.textContent = '👑 ';
                crownHtml.style.cssText = 'font-size:1.3em; margin-right:4px;';
                name.appendChild(crownHtml);
            }
            if (r.banner) {
                const b = getBanner(r.banner);
                if (b) row.classList.add(b.css);
            }
            name.appendChild(document.createTextNode(r.name));
            row.appendChild(name);

            const score = document.createElement('span');
            score.className = 'lb-score';
            score.textContent = r.score + ' pts';
            if (i === 0) score.style.cssText = 'color:#ffd700; font-size:1.1em; font-weight:bold;';
            row.appendChild(score);

            list.appendChild(row);
        });
    },
    renderTop3() {
        const el = document.getElementById('top3-list');
        if (!el) return;
        const rows = Storage.getLeaderboard().filter(r => r.score > 0).slice(0, 3);
        if (rows.length === 0) { el.innerHTML = '<p style="color:#888;font-size:0.6em;">Sin puntajes aún</p>'; return; }
        const medals = ['🥇', '🥈', '🥉'];
        el.innerHTML = rows.map((r, i) => {
            const b = r.banner ? getBanner(r.banner) : null;
            const cls = b ? b.css : '';
            const top = i === 0 ? 'top1-aura' : '';
            return `<div style="font-size:0.6em;margin:4px 0">${medals[i]} <span class="${cls} ${top}">${r.name}</span> <span style="color:#ffcc00">${r.score}</span></div>`;
        }).join('');
    }
};

window.shopSwitchTab = function (tab) {
    var secBanners = document.getElementById('shop-section-banners');
    var secRunas = document.getElementById('shop-section-runas');
    var tabBanners = document.getElementById('tab-banners');

    var submenuBanners = document.getElementById('submenu-banners');
    var submenuRunas = document.getElementById('submenu-runas');
    var tabRunas = document.getElementById('tab-runas');

    var shopPanel = document.querySelector('.shop-panel');

    if (tab === 'runas') {
        if (secBanners) secBanners.style.display = 'none';
        if (secRunas) secRunas.style.display = 'block';
        if (tabBanners) {
            tabBanners.classList.remove('active');
            tabBanners.innerHTML = '🔮 RUNAS ▾';
        }
        if (tabRunas) tabRunas.classList.add('active');
        if (submenuBanners) submenuBanners.classList.remove('active');
        if (submenuRunas) submenuRunas.classList.add('active');
        if (shopPanel) shopPanel.classList.remove('theme-beach');
    } else {
        if (secRunas) secRunas.style.display = 'none';
        if (secBanners) secBanners.style.display = 'block';
        if (tabBanners) {
            tabBanners.classList.add('active');
            tabBanners.innerHTML = '🎖 ESTANDARTES ▾';
        }
        if (tabRunas) tabRunas.classList.remove('active');
        if (submenuBanners) submenuBanners.classList.add('active');
        if (submenuRunas) submenuRunas.classList.remove('active');
        if (shopPanel) shopPanel.classList.add('theme-beach');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Shop.init();
    const shopBtn = document.getElementById('hud-shop-btn');
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            shopSwitchTab('banners');
            Shop.open();
        });
    }

    const closeShop = document.getElementById('close-shop');
    if (closeShop) closeShop.addEventListener('click', () => Shop.close());

    const closeLB = document.getElementById('close-lb');
    if (closeLB) closeLB.addEventListener('click', () => LB.close());

    document.getElementById('shop-overlay')?.addEventListener('click', e => {
        if (e.target.id === 'shop-overlay') Shop.close();
    });
    document.getElementById('lb-overlay')?.addEventListener('click', e => {
        if (e.target.id === 'lb-overlay') LB.close();
    });

    const promoBtn = document.getElementById('promo-code-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', () => Shop.redeemCode());
    }
    const promoInput = document.getElementById('promo-code-input');
    if (promoInput) {
        promoInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') Shop.redeemCode();
        });
    }

    var tabBannersBtn = document.getElementById('tab-banners');
    if (tabBannersBtn) {
        tabBannersBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var wrapper = this.parentNode;
            if (wrapper) {
                wrapper.classList.toggle('open');
            }
        });
    }

    document.addEventListener('click', function () {
        var wrapper = document.querySelector('.shop-tab-wrapper');
        if (wrapper) {
            wrapper.classList.remove('open');
        }
    });

    var returnMenuBtn = document.getElementById('return-menu-btn');
    if (returnMenuBtn) {
        returnMenuBtn.addEventListener('click', function () {
            setTimeout(function () {
                if (window.UI) {
                    UI.stopSound('background');
                    UI.playSound('lobby');
                    UI.playSound('lobby-seagulls');
                }
            }, 300);
        });
    }
});
    }
});
