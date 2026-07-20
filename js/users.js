// =============================================================================
// USERS — Trials of Mastery
// =============================================================================

const Users = {
    current: null,
    data: null,

    // =========================================================================
    // init — Set up name selector and user card
    // =========================================================================
    init() {
        const sel = document.getElementById('player-name-input');
        if (!sel) return;

        // Warning label
        const warning = document.createElement('div');
        warning.id = 'select-warning';
        warning.innerHTML = '⚠ SELECCIONA TU NOMBRE PARA JUGAR';
        warning.style.display = 'none';
        sel.parentNode.insertBefore(warning, sel.nextSibling);

        // User card (lobby preview)
        const userCard = document.createElement('div');
        userCard.id = 'selected-user-card';
        userCard.innerHTML =
            '<span class="card-username" id="card-username">—</span>' +
            '<span class="card-coins">🪙 Coins: <span id="card-coins-val">0</span></span><br>' +
            '<span class="card-score">🏆 Best: <span id="card-score-val">0</span></span>' +
            '<span class="card-banner-preview-wrap" id="card-banner-preview"></span>';
        warning.parentNode.insertBefore(userCard, warning.nextSibling);

        // Name change
        sel.addEventListener('change', e => {
            const name = e.target.value;
            if (name) {
                localStorage.setItem('savedPlayerName', name);
                document.cookie = "savedPlayerName=" + encodeURIComponent(name) + "; max-age=31536000; path=/";
            } else {
                localStorage.removeItem('savedPlayerName');
                document.cookie = "savedPlayerName=; max-age=0; path=/";
            }

            if (!name) {
                userCard.style.display = 'none';
                warning.style.display = 'none';
                this.current = null;
                this.data = null;
                this._hideHUD();
                return;
            }

            this.load(name);
        });

        // Cookie helper
        function getCookie(cookieName) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + cookieName + "=");
            if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
            return null;
        }

        // Auto-load saved name
        const savedName = localStorage.getItem('savedPlayerName') || getCookie('savedPlayerName');
        if (savedName) {
            for (let i = 0; i < sel.options.length; i++) {
                if (sel.options[i].value === savedName) {
                    sel.value = savedName;
                    this.load(savedName);
                    break;
                }
            }
        }

        // Block START if no user selected
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', e => {
                if (!sel.value) {
                    e.stopImmediatePropagation();
                    warning.style.display = 'block';
                    sel.style.borderColor = '#ff3300';
                    sel.style.boxShadow = '0 0 15px rgba(255,51,0,0.6)';
                    setTimeout(() => {
                        sel.style.borderColor = '';
                        sel.style.boxShadow = '';
                    }, 2000);
                }
            }, true);
        }
    },

    // =========================================================================
    // load — Load a user profile, then sync from cloud
    // =========================================================================
    load(name) {
        if (!name) { this.current = null; this.data = null; this._hideHUD(); return; }

        this.current = name;
        const rawData = Storage.getUser(name);

        // Wrap in security Proxy
        this.data = this._createSecureProxy(rawData, name);

        // Validate exclusive banners
        if (this.data.equippedBanner === 'royal_zenith' || this.data.equippedBanner === 'celestial_king') {
            const rows = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
            const isTop1 = rows.length > 0 && rows[0].name === name;
            const owned = (this.data.ownedBanners || []).includes(this.data.equippedBanner);
            if (!isTop1 && !owned) {
                this.data.equippedBanner = null;
                this.save();
            }
        }

        this._showHUD();
        this.updateUI();

        // Apply settings
        if (typeof window.applySettings === 'function') {
            window.applySettings(rawData.settings || {});
        }

        // Show Historia button
        const btn = document.getElementById('historia-btn');
        if (btn) {
            btn.style.display = 'block';
            if (!btn._historiaListenerAdded) {
                btn.addEventListener('click', () => {
                    if (typeof SecretFeatures !== 'undefined') SecretFeatures.unlockMiHistoria();
                });
                btn._historiaListenerAdded = true;
            }
        }
        
        if (typeof window.fetchProfileFromCloud === 'function') {
            window.fetchProfileFromCloud(name);
        }
    },

    // =========================================================================
    // save — Persist to localStorage and schedule cloud sync
    // =========================================================================
    save() {
        if (!this.current || !this.data) return;

        // Get raw data from proxy for storage
        const rawData = this._getRaw();
        rawData.lastSaved = Date.now();

        Storage.saveUser(this.current, rawData);

        if (typeof window.syncProfile === 'function') {
            if (this._syncTimeout) clearTimeout(this._syncTimeout);
            this._syncTimeout = setTimeout(() => {
                window.syncProfile(this.current, rawData);
            }, 1500);
        }
    },

    // =========================================================================
    // updateUI — Unified method to refresh all player-related UI
    // =========================================================================
    updateUI() {
        if (!this.data) return;
        this._syncAllCoinDisplays();
        this._showPreview();
        this._applyBannerToName();

        // If the shop is open, re-render it
        const shopOv = document.getElementById('shop-overlay');
        if (shopOv && shopOv.classList.contains('open') && typeof Shop !== 'undefined') {
            Shop.render();
        }

        // If the inventory is open, re-render it
        const invOv = document.getElementById('inventory-overlay');
        if (invOv && invOv.style.display === 'flex' && typeof renderInventory === 'function') {
            renderInventory();
        }
    },

    // =========================================================================
    // Coin management
    // =========================================================================
    addCoins(n) {
        if (!this.data) return;
        const newCoins = (this.data.coins || 0) + n;
        this.data.coins = newCoins; // proxy handles cap + report
        this.save();
        this.updateUI();
    },

    // =========================================================================
    // Score / Stats
    // =========================================================================
    updateHighScore(s) {
        if (!this.data) return;
        if (s > (this.data.highScore || 0)) {
            this.data.highScore = s; // proxy handles cap + report
            this.save();
        }
        this._showPreview();
    },

    // =========================================================================
    // Banner management
    // =========================================================================
    equipBanner(id) {
        if (!this.data) return;
        const rows = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
        const isTop1 = rows.length > 0 && rows[0].name === this.current;
        const isTopBn = id === 'royal_zenith' || id === 'celestial_king';
        const canEquip = (this.data.ownedBanners || []).includes(id) || (isTopBn && isTop1);
        if (!canEquip) return;

        this.data.equippedBanner = id;
        this.save();
        this.updateUI();
    },

    unequipBanner() {
        if (!this.data) return;
        this.data.equippedBanner = null;
        this.save();
        this.updateUI();
    },

    buyBanner(id) {
        if (!this.data) return false;
        const b = getBanner(id);
        if (!b) return false;
        if ((this.data.ownedBanners || []).includes(id)) return false;
        if (this.data.coins < b.price) return false;
        this.data.coins -= b.price;
        this.data.ownedBanners = this.data.ownedBanners || [];
        this.data.ownedBanners.push(id);
        this.save();
        this.updateUI();
        return true;
    },

    // =========================================================================
    // Rune management
    // =========================================================================
    equipRune(id) {
        if (!this.data) return;
        if (!(this.data.ownedRunes || []).includes(id)) return;
        this.data.equippedRune = id;
        this.save();
        this.updateUI();
    },

    unequipRune() {
        if (!this.data) return;
        this.data.equippedRune = null;
        this.save();
        this.updateUI();
    },

    buyRune(id) {
        if (!this.data) return false;
        const r = typeof getRune === 'function' ? getRune(id) : null;
        if (!r) return false;
        if (this.data.coins < r.price) return false;
        this.data.coins -= r.price;
        this.data.ownedRunes = this.data.ownedRunes || [];
        this.data.runeQuantities = this.data.runeQuantities || {};
        if (!this.data.ownedRunes.includes(id)) this.data.ownedRunes.push(id);
        this.data.runeQuantities[id] = (this.data.runeQuantities[id] || 0) + 1;
        this.save();
        this.updateUI();
        return true;
    },

    useRune(id) {
        if (!this.data) return false;
        if (!this.data.runeQuantities || !this.data.runeQuantities[id] || this.data.runeQuantities[id] <= 0) return false;

        const rInfo = typeof getRune === 'function' ? getRune(id) : null;
        if (!rInfo) return false;

        // If it's a targeted rune, send it via Multiplayer and wait for GAS validation
        if (rInfo.targeted) {
            const target = window.currentRuneTarget;
            if (!target || target.trim() === '') {
                if (typeof showRuneAlert === 'function') showRuneAlert("Esta runa de ataque requiere un objetivo.", "#ff0000");
                return false;
            }
            if (typeof Multiplayer !== 'undefined' && Multiplayer.sendAttack) {
                Multiplayer.sendAttack(this.current, target, id);
                if (typeof UI !== 'undefined' && UI.closeModals) UI.closeModals();
            }
            return true;
        }

        // Apply Gameplay / Defense effect locally
        if (typeof applyRune === 'function') {
            const success = applyRune(id);
            if (!success) return false;
        }

        // Reduce quantity locally for Gameplay / Defense
        this.data.runeQuantities[id] -= 1;
        if (this.data.runeQuantities[id] <= 0) {
            delete this.data.runeQuantities[id];
            this.data.ownedRunes = (this.data.ownedRunes || []).filter(r => r !== id);
            if (this.data.equippedRune === id) this.data.equippedRune = null;
        }

        this.save();
        this.updateUI();
        return true;
    },

    hasRune(id) {
        if (!this.data) return false;
        return !!(this.data.runeQuantities && this.data.runeQuantities[id] > 0);
    },

    consumeRune(id) { return this.useRune(id); },

    // =========================================================================
    // HUD helpers
    // =========================================================================
    _showHUD() {
        const h = document.getElementById('shop-hud');
        if (h) h.style.display = 'flex';
    },
    _hideHUD() {
        const h = document.getElementById('shop-hud');
        if (h) h.style.display = 'none';
        const btn = document.getElementById('historia-btn');
        if (btn) btn.style.display = 'none';
    },
    _syncAllCoinDisplays() {
        if (!this.data) return;
        const c = this.data.coins || 0;
        ['hud-coins-val', 'shop-bal', 'card-coins-val'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = c;
        });
    },
    _showPreview() {
        if (!this.data) return;
        const userCard = document.getElementById('selected-user-card');
        if (userCard) userCard.style.display = 'block';

        const cName = document.getElementById('card-username');
        if (cName) cName.innerHTML = '👤 ' + this.current;

        this._syncAllCoinDisplays();

        const s = document.getElementById('card-score-val');
        if (s) s.textContent = this.data.highScore || 0;

        const bp = document.getElementById('card-banner-preview');
        if (bp) {
            bp.innerHTML = '';
            if (this.data.equippedBanner && typeof getBanner === 'function') {
                const bn = getBanner(this.data.equippedBanner);
                if (bn) {
                    const sp = document.createElement('span');
                    sp.className = bn.css;
                    sp.style.fontSize = '0.9em';
                    sp.textContent = this.current;
                    bp.appendChild(document.createTextNode('🎖 '));
                    bp.appendChild(sp);
                }
            } else {
                bp.textContent = '🎖 Sin banner equipado';
            }
        }
    },
    _applyBannerToName() {
        const nameSpan = document.getElementById('player-name-display');
        if (!nameSpan || !this.data) return;
        nameSpan.className = '';
        if (this.data.equippedBanner && typeof getBanner === 'function') {
            const b = getBanner(this.data.equippedBanner);
            if (b) nameSpan.className = b.css;
        }
    },

    // =========================================================================
    // _getRaw — Extract plain object from proxy (for serialization)
    // =========================================================================
    _getRaw() {
        try {
            return JSON.parse(JSON.stringify(this.data));
        } catch (_) {
            return this.data;
        }
    },

    // =========================================================================
    // _createSecureProxy — Wrap user data to intercept writes and enforce limits
    // =========================================================================
    _createSecureProxy(rawData, playerName) {
        const MAX_COINS = 3000;
        const MAX_SCORE = 3000;
        const MAX_STREAK = 3000;

        const handler = {
            set(target, prop, value) {
                // Numeric sanity caps
                if (prop === 'coins') {
                    const n = parseInt(value) || 0;
                    if (n > MAX_COINS) {
                        if (typeof window.reportCheat === 'function') {
                            window.reportCheat({
                                cheatType: 'coin_overflow',
                                reason: 'coins set above cap via JS',
                                alteredValue: n,
                                evidence: 'Player: ' + playerName + ', Attempted: ' + n
                            });
                        }
                        target[prop] = MAX_COINS;
                        return true;
                    }
                    target[prop] = Math.max(0, n);
                    return true;
                }
                if (prop === 'highScore') {
                    const n = parseInt(value) || 0;
                    if (n > MAX_SCORE) {
                        if (typeof window.reportCheat === 'function') {
                            window.reportCheat({
                                cheatType: 'score_overflow',
                                reason: 'highScore set above cap via JS',
                                alteredValue: n,
                                evidence: 'Player: ' + playerName + ', Attempted: ' + n
                            });
                        }
                        target[prop] = MAX_SCORE;
                        return true;
                    }
                    target[prop] = Math.max(0, n);
                    return true;
                }
                if (prop === 'maxStreak') {
                    const n = parseInt(value) || 0;
                    target[prop] = Math.min(MAX_STREAK, Math.max(0, n));
                    return true;
                }
                target[prop] = value;
                return true;
            }
        };

        return new Proxy(rawData, handler);
    }
};

document.addEventListener('DOMContentLoaded', () => Users.init());
