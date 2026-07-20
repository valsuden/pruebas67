// =============================================================================
// API Y RED — Trials of Mastery
// =============================================================================
(function () {
    'use strict';

    // =========================================================================
    // 1. URL DEL SERVIDOR — Obtenida de CONFIG si está disponible
    // =========================================================================
    window.leaderboardAPI = (window.CONFIG && window.CONFIG.API_URL) || "https://script.google.com/macros/s/AKfycbwaMPSGNLt_O6wrVPyrRCYncqah78qWaq1Z4jFoyin_ve0LjcC3ughzEzlPDAw4RfHUVg/exec";

    // =========================================================================
    // 2. CÓDIGOS PROMOCIONALES PREDETERMINADOS
    // =========================================================================
    const _defaultCodes = (typeof _getSecretCodes === 'function' ? _getSecretCodes() : []); // hashes now

    var _initCustomCodes = [];
    try {
        var raw = localStorage.getItem('tom_cc_data');
        if (raw) {
            try {
                _initCustomCodes = JSON.parse(atob(raw));
            } catch (e) {
                console.warn("⚠️ Datos corruptos en tom_cc_data. Reiniciando.");
                localStorage.removeItem('tom_cc_data');
                _initCustomCodes = [];
            }
        }
    } catch (e) {
        console.warn("⚠️ Error al leer tom_cc_data:", e);
        _initCustomCodes = [];
    }
    window.CODES_DATA = _defaultCodes.concat(_initCustomCodes);

    // =========================================================================
    // 3. ANTI-CHEAT: Generación de Hash de Firma
    // =========================================================================
    window.generateHash = function (name, score, streak) {
        if (score > 3000 || streak > 3000) {
            console.warn("Anti-Cheat: Valores inválidos detectados. El servidor rechazará este guardado.");
            return "CHEAT_DETECTED_INVALID_HASH_REJECTED";
        }
        var salt = (window.CONFIG && window.CONFIG.SECURITY_SALT_API) || "trialsofmastery2025";
        var str = name + score + streak + salt;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36);
    };

    // =========================================================================
    // 4. GUARDAR PUNTUACIÓN EN EL LEADERBOARD GLOBAL -> SYNC PROFILE
    // =========================================================================
    window.saveToLeaderboard = function (playerName, score) {
        if (typeof Users !== 'undefined' && Users.current && Users.data) {
            // Sincronizar todo el perfil en lugar de solo algunas variables
            Users.save();
        }
    };

    window.syncProfile = function (name, profileObj) {
        try {
            var rawName = name || 'Player';
            if (rawName === 'Guest') return;

            var profileStr = JSON.stringify(profileObj);
            var salt = (window.CONFIG && window.CONFIG.SECURITY_SALT_API) || "trialsofmastery2025";
            var str = rawName + salt;
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            var finalHash = Math.abs(hash).toString(36);

            var formData = new URLSearchParams();
            formData.append('action', 'syncProfile');
            formData.append('name', rawName);
            formData.append('profile', profileStr);
            formData.append('hash', finalHash);

            fetch(window.leaderboardAPI, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            }).then(function () {
                localStorage.removeItem('pendingProfileSync');
                console.log('Leaderboard: perfil sincronizado vía fetch POST (no-cors)');
            }).catch(function (e) {
                console.error('Error de red al sincronizar:', e);
                _saveProfilePending(rawName, profileObj);
            });

        } catch (e) {
            console.error('Error al sincronizar perfil:', e);
            _saveProfilePending(name, profileObj);
        }
    };

    function _saveProfilePending(name, profileObj) {
        try {
            localStorage.setItem('pendingProfileSync', JSON.stringify({ name: name, profile: profileObj }));
        } catch (e) {
            console.warn("⚠️ No se pudo guardar pendingProfileSync:", e);
        }
        console.warn('Leaderboard: sincronización pendiente para el próximo intento.');
    }

    // =========================================================================
    // 5. REINTENTAR GUARDADO PENDIENTE
    // =========================================================================
    window.retrySendPending = function () {
        var pending = localStorage.getItem('pendingProfileSync');
        if (!pending) return;
        try {
            var data = JSON.parse(pending);
            window.syncProfile(data.name, data.profile);
        } catch (e) {
            console.error('Error en reintento:', e);
            localStorage.removeItem('pendingProfileSync');
        }
    };

    // =========================================================================
    // 6. MOSTRAR LEADERBOARD GLOBAL (JSONP)
    // =========================================================================
    window.showLeaderboard = function () {
        var list = document.getElementById('leaderboard-list');
        if (!list) return;
        list.innerHTML = '<p>Cargando puntajes...</p>';

        var oldScript = document.getElementById('leaderboard-jsonp-script');
        if (oldScript) oldScript.remove();

        var script = document.createElement('script');
        script.id = 'leaderboard-jsonp-script';
        script.src = window.leaderboardAPI + '?callback=handleLeaderboardData&t=' + Date.now();
        script.onerror = function () {
            list.innerHTML = '<p style="color:#ff3333;">Error de conexión (Posible 403).<br>Verifica que publicaste el Google Apps Script con acceso a "Anyone" (Cualquier persona).</p>';
            window.openLeaderboardModal();
        };
        document.body.appendChild(script);

        setTimeout(function () {
            if (list.innerHTML.includes('Cargando')) {
                list.innerHTML = '<p>Tiempo de espera agotado.</p>';
                window.openLeaderboardModal();
            }
        }, 8000);
    };

    window.handleLeaderboardData = function (data) {
        var list = document.getElementById('leaderboard-list');
        try {
            if (data && data.error) {
                var errMsg = _escapeHtml(data.error);
                var isNoSheet = data.error.toLowerCase().includes('no sheet') ||
                    data.error.toLowerCase().includes('sheet') ||
                    data.error.toLowerCase().includes('cannot read');
                var extraHint = isNoSheet
                    ? '<br><span style="color:#ff9900;">⚠️ El admin debe ejecutar <b>setupSheets()</b> en Google Apps Script para crear las hojas.</span>'
                    : '';
                list.innerHTML = '<p style="color:#ffcc00;">⚠️ Error del servidor: "' + errMsg + '".' + extraHint + '</p>';
                if (isNoSheet) {
                    setTimeout(function () {
                        if (list.innerHTML.includes('setupSheets')) {
                            list.innerHTML = '<p style="color:#aaffaa;">🔄 Reintentando conexión...</p>';
                            window.showLeaderboard();
                        }
                    }, 5000);
                }
                window.openLeaderboardModal();
                return;
            }
            if (!Array.isArray(data) || data.length === 0) {
                list.innerHTML = '<p>¡No hay puntajes aún. Sé el primero!</p>';
                window.openLeaderboardModal();
                return;
            }

            var uniquePlayers = {};
            data.forEach(function (entry) {
                if (!entry || !entry.name) return;
                var n = String(entry.name).trim();
                var s = Number(entry.score) || 0;
                if (!uniquePlayers[n] || s > (Number(uniquePlayers[n].score) || 0)) {
                    uniquePlayers[n] = entry;
                }
            });
            var uniqueData = Object.values(uniquePlayers);
            uniqueData.sort(function (a, b) { return Number(b.score) - Number(a.score); });
            var top20 = uniqueData.slice(0, 20);
            var medals = ['🥇', '🥈', '🥉'];

            var html = top20.map(function (r, i) {
                var isTop1 = i === 0;
                var medal = medals[i] || '';
                var rowClass = isTop1 ? 'lb-global-row top1-row' : 'lb-global-row';
                var nameClass = isTop1 ? 'lb-global-name lb-king-name' : 'lb-global-name';
                var localU = typeof Storage !== 'undefined' ? Storage.getUser(r.name) : null;
                var bannerId = r.banner || (localU ? localU.equippedBanner : null);

                if (bannerId && typeof getBanner !== 'undefined') {
                    var b = getBanner(bannerId);
                    if (b) rowClass += ' ' + b.css;
                }
                var crownHtml = isTop1 ? '<span class="top1-crown">👑</span>' : '';
                var scoreStyle = isTop1 ? 'color:#ffd700;font-size:1.1em;font-weight:bold;' : '';
                return '<div class="' + rowClass + '">' +
                    '<span class="lb-global-medal">' + medal + '</span>' +
                    '<span class="lb-global-num">' + (i + 1) + '.</span>' +
                    '<span class="' + nameClass + '">' + crownHtml + _escapeHtml(r.name) + '</span>' +
                    '<span class="lb-global-score" style="' + scoreStyle + '">' + _escapeHtml(String(r.score)) + ' pts</span>' +
                    '<span class="lb-global-streak">🔥' + _escapeHtml(String(r.streak || 0)) + '</span>' +
                    '</div>';
            }).join('');

            var totalPlayers = uniqueData.length;
            var footer = totalPlayers > 20
                ? '<p style="margin-top:15px;color:#00ff4c;font-size:0.6em;">Mostrando top 20 de ' + totalPlayers + ' jugadores</p>'
                : '';
            list.innerHTML = html + footer;
            window.openLeaderboardModal();
        } catch (e) {
            console.error('Error mostrando leaderboard:', e);
            list.innerHTML = '<p>Error mostrando puntajes.</p>';
            window.openLeaderboardModal();
        }
    };

    // =========================================================================
    // 7. TOP 3 EN VIVO DURANTE EL JUEGO
    // =========================================================================
    var _top3Interval = null;

    window.loadTop3Display = function () {
        var top3List = document.getElementById('top3-list');
        if (!top3List) return;
        top3List.innerHTML = '<p style="color:#00ff4c;">Cargando...</p>';

        window.top3Callback = function (data) {
            try {
                if (data && data.error) {
                    top3List.innerHTML = '<p style="color:#ffcc00;">Error: ' + _escapeHtml(data.error) + '</p>';
                    return;
                }
                if (!Array.isArray(data) || data.length === 0) {
                    top3List.innerHTML = '<p style="color:#ffffff;">¡Sé el primero en jugar!</p>';
                    return;
                }
                data.sort(function (a, b) { return Number(b.score) - Number(a.score); });
                var top3 = data.slice(0, 3);
                var medals = ['🥇', '🥈', '🥉'];
                top3List.innerHTML = top3.map(function (player, i) {
                    return '<p style="color:#ffffff;margin:5px 0;">' +
                        medals[i] + ' ' + _escapeHtml(player.name) +
                        ': <span style="color:#ffcc00;">' + player.score + '</span></p>';
                }).join('') || '<p style="color:#ffffff;">¡Sin puntajes aún!</p>';
            } catch (e) {
                top3List.innerHTML = '<p style="color:#ff3333;">Error cargando</p>';
            }
            const oldScript = document.getElementById('top3-jsonp-script');
            if (oldScript) oldScript.remove();
        };

        var oldScript = document.getElementById('top3-jsonp-script');
        if (oldScript) oldScript.remove();

        var script = document.createElement('script');
        script.id = 'top3-jsonp-script';
        script.src = window.leaderboardAPI + '?callback=top3Callback&t=' + Date.now();
        document.body.appendChild(script);
    };

    window.startTop3Updates = function () {
        window.loadTop3Display();
        if (_top3Interval) clearInterval(_top3Interval);
        _top3Interval = setInterval(function () { window.loadTop3Display(); }, 30000);
    };

    window.stopTop3Updates = function () {
        if (_top3Interval) { clearInterval(_top3Interval); _top3Interval = null; }
    };

    // =========================================================================
    // 8. MODAL DE LEADERBOARD GLOBAL
    // =========================================================================
    window.openLeaderboardModal = function () {
        var backdrop = document.getElementById('leaderboard-modal-backdrop');
        if (!backdrop) return;
        backdrop.style.display = 'flex';
        backdrop.setAttribute('aria-hidden', 'false');
        _playModalSound();
    };

    window.closeLeaderboardModal = function () {
        var backdrop = document.getElementById('leaderboard-modal-backdrop');
        if (!backdrop) return;
        backdrop.style.display = 'none';
        backdrop.setAttribute('aria-hidden', 'true');
    };

    function _playModalSound() {
        try {
            var audio = new Audio('https://freesound.org/data/previews/522/522375_11682929-lq.mp3');
            audio.volume = 0.3;
            audio.play().catch(function () { });
        } catch (e) { }
    }

    // =========================================================================
    // 9. DESCARGAR CSV DEL LEADERBOARD
    // =========================================================================
    window.downloadLeaderboardCSV = function () {
        if (typeof Storage === 'undefined') return;
        var rows = Storage.getLeaderboard();
        if (!rows || rows.length === 0) { alert('No hay puntajes locales para exportar.'); return; }
        var csv = 'Pos,Nombre,Puntaje\n';
        rows.forEach(function (r, i) {
            csv += (i + 1) + ',' + r.name.replace(/,/g, '') + ',' + r.score + '\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'leaderboard_arcane.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // =========================================================================
    // 10. CÓDIGOS ONLINE (JSONP)
    // =========================================================================
    window.loadOnlineCodesCallback = function (data) {
        if (data && data.success && Array.isArray(data.codes)) {
            var localCustom = [];
            try {
                var rawCC = localStorage.getItem('tom_cc_data');
                if (rawCC) localCustom = JSON.parse(atob(rawCC));
            } catch (e) { localCustom = []; }
            var allCustom = localCustom.concat(data.codes);
            var uniqueCustom = [];
            var seen = {};
            for (var i = allCustom.length - 1; i >= 0; i--) {
                var c = allCustom[i];
                if (!seen[c.code]) { seen[c.code] = true; uniqueCustom.unshift(c); }
            }
            window.CODES_DATA = _defaultCodes.concat(uniqueCustom);
            console.log("☁️ Códigos dinámicos cargados desde la nube.");
        }
    };

    setTimeout(function () {
        var s = document.createElement('script');
        s.src = window.leaderboardAPI + '?action=getCodes&callback=loadOnlineCodesCallback&t=' + Date.now();
        document.body.appendChild(s);
    }, 1500);

    // =========================================================================
    // 11. SINCRONIZACIÓN DE PERFIL ONLINE — Smart Merge
    // =========================================================================

    function _clientDeepMerge(local, online, onlineIsNewer) {
        var result = {};
        var allKeys = Object.keys(Object.assign({}, local, online));

        allKeys.forEach(function (key) {
            var lv = local[key];
            var ov = online[key];

            if (key === 'settings') {
                result[key] = Object.assign({}, ov || {}, lv || {});
            } else if (key === 'lastSaved') {
                result[key] = Math.max(parseInt(lv) || 0, parseInt(ov) || 0);
            } else if (key === 'cheatFlags') {
                var merged = (lv || []).concat(ov || []);
                var seen = {};
                result[key] = merged.filter(function (cf) {
                    var k = cf.id || (cf.type + (cf.time || cf.date || ''));
                    if (seen[k]) return false;
                    seen[k] = true;
                    return true;
                });
            } else if (key === 'coins' || key === 'highScore' || key === 'maxStreak') {
                if (onlineIsNewer) {
                    result[key] = (ov !== undefined && ov !== null) ? parseInt(ov) : parseInt(lv) || 0;
                } else {
                    result[key] = Math.max(parseInt(lv) || 0, parseInt(ov) || 0);
                }
            } else if (key === 'runeQuantities') {
                if (onlineIsNewer) {
                    result[key] = ov || {};
                } else {
                    var rq = Object.assign({}, lv || {});
                    var oq = ov || {};
                    Object.keys(oq).forEach(function (rid) {
                        rq[rid] = Math.max(parseInt(rq[rid]) || 0, parseInt(oq[rid]) || 0);
                    });
                    result[key] = rq;
                }
            } else if (key === 'stats' && typeof ov === 'object' && ov !== null) {
                result[key] = _clientDeepMerge(lv || {}, ov, onlineIsNewer);
            } else if (Array.isArray(ov) || Array.isArray(lv)) {
                var arr = (lv || []).concat(ov || []);
                result[key] = arr.filter(function (v, i, a) { return a.indexOf(v) === i; });
            } else if (typeof ov === 'object' && ov !== null && typeof lv === 'object' && lv !== null) {
                result[key] = _clientDeepMerge(lv, ov, onlineIsNewer);
            } else {
                result[key] = (lv !== undefined && lv !== null) ? lv : ov;
            }
        });

        return result;
    }

    window.syncProfileCallback = function (data) {
        if (!data || !data.success || !data.profile) return;
        try {
            var rawProfile = data.profile;
            var onlineData;

            try {
                onlineData = JSON.parse(rawProfile);
            } catch (_) {
                try { onlineData = JSON.parse(atob(rawProfile)); }
                catch (__) { console.warn('syncProfileCallback: could not parse profile'); return; }
            }

            var name = data.name;
            if (typeof Users === 'undefined' || Users.current !== name) return;

            var localData = Users._getRaw ? Users._getRaw() : (Users.data || {});

            var localSaved = parseInt(localData.lastSaved) || 0;
            var onlineSaved = parseInt(onlineData.lastSaved) || 0;

            var merged;
            if (localSaved === 0 && onlineSaved > 0) {
                merged = Object.assign({}, onlineData, { settings: localData.settings || onlineData.settings || {} });
            } else {
                var onlineIsNewer = onlineSaved > localSaved;
                merged = _clientDeepMerge(localData, onlineData, onlineIsNewer);
            }

            merged.coins = Math.min(3000, Math.max(0, parseInt(merged.coins) || 0));
            merged.highScore = Math.min(3000, Math.max(0, parseInt(merged.highScore) || 0));

            if (typeof Users._createSecureProxy === 'function') {
                Users.data = Users._createSecureProxy(merged, name);
            } else {
                Users.data = merged;
            }

            if (typeof Storage !== 'undefined' && Storage._saveAll) {
                Storage.saveUser(name, merged);
            }

            if (typeof Users.updateUI === 'function') Users.updateUI();

            if (merged.settings && typeof window.applySettings === 'function') {
                window.applySettings(merged.settings);
            }

            console.log('☁️ Perfil de "' + name + '" sincronizado. Local: ' + new Date(localSaved).toLocaleTimeString() + ' | Nube: ' + new Date(onlineSaved).toLocaleTimeString());
        } catch (e) { console.error('Error al fusionar perfil de la nube:', e); }
    };

    window.fetchProfileFromCloud = function (name) {
        if (!name || name === 'Guest' || !window.leaderboardAPI) return;
        var cbName = 'syncProfileCallback';
        var s = document.createElement('script');
        s.src = window.leaderboardAPI +
            '?action=getProfile&name=' + encodeURIComponent(name) +
            '&callback=' + cbName + '&t=' + Date.now();
        document.body.appendChild(s);
    };

    // =========================================================================
    // 12. SISTEMA DE ADMINISTRADOR (protegido por contraseña)
    // =========================================================================
    var _adminUnlocked = false;
    var _adminLocked = true;

    function _adminDenied(type) {
        console.log('%c ¿ERES IDIOTA? ', 'background:#ff0000;color:#fff;font-size:16px;font-family:monospace;padding:4px 10px;border-radius:3px;');

        type = type || 'desconocido';

        if (typeof window.reportCheat === 'function') {
            window.reportCheat({
                cheatType: 'console_tampering',
                reason: 'Unauthorized access attempt via browser console: ' + type,
                alteredValue: type,
                evidence: 'Admin-locked property accessed without valid password'
            });
        }
    }
    function _adminOk(msg) {
        console.log('%c ✓ ' + msg, 'background:#003300;color:#00ff4c;font-size:13px;font-family:monospace;padding:3px 8px;border-radius:3px;');
    }

    async function _sha256(message) {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
            var hash = 5381;
            for (var i = 0; i < message.length; i++) {
                hash = ((hash << 5) + hash) + message.charCodeAt(i);
            }
            var hex = (hash >>> 0).toString(16);
            if (hex === "6c766fab") {
                return "92115aa11c4ebbd8547544c0d18015d06f5787e79e89936805cb110403725f7e";
            }
            return "unsupported";
        }
    }

    window.adminLogin = async function (password) {
        if (!password) {
            _adminUnlocked = false;
            _adminLocked = true;
            _adminDenied('admin login');
            return;
        }
        try {
            const enteredHash = await _sha256(password);
            const targetHash = (window.CONFIG && window.CONFIG.ADMIN_PASSWORD_HASH) || "92115aa11c4ebbd8547544c0d18015d06f5787e79e89936805cb110403725f7e";
            if (enteredHash === targetHash) {
                _adminUnlocked = true;
                _adminLocked = false;
                _adminOk('Modo Admin desbloqueado. Comandos disponibles: score, coins, saveLeader, modLeader, addCode, addnota');
            } else {
                _adminUnlocked = false;
                _adminLocked = true;
                _adminDenied('admin login');
            }
        } catch (e) {
            console.error("Error en adminLogin:", e);
            _adminUnlocked = false;
            _adminLocked = true;
            _adminDenied('admin login');
        }
    };

    function _addCodeFunc(codeName) {
        if (_adminLocked) { _adminDenied('codes'); return; }
        if (!codeName || typeof codeName !== 'string' || !codeName.trim()) {
            console.error("❌ Código inválido."); return;
        }
        var name = codeName.trim().toUpperCase();
        var daysInput = prompt("🔑 [ADMIN] DÍAS de validez (0 = configurar por horas):");
        if (daysInput === null) { console.log("❌ Cancelado."); return; }
        var days = parseInt(daysInput.trim());
        if (isNaN(days) || days < 0) { alert("❌ Días inválido."); return; }

        var expiresAt = "";
        if (days === 0) {
            var hoursInput = prompt("🕒 [ADMIN] HORAS de validez:");
            if (hoursInput === null) { console.log("❌ Cancelado."); return; }
            var hours = parseInt(hoursInput.trim());
            if (isNaN(hours) || hours <= 0) { alert("❌ Horas inválidas."); return; }
            var dt = new Date(Date.now() + hours * 3600 * 1000);
            expiresAt = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0') + ' ' + String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0');
        } else {
            var dt2 = new Date(Date.now() + days * 24 * 3600 * 1000);
            expiresAt = dt2.getFullYear() + '-' + String(dt2.getMonth() + 1).padStart(2, '0') + '-' + String(dt2.getDate()).padStart(2, '0');
        }

        var coinsInput = prompt("🪙 [ADMIN] Arcane Coins de recompensa:");
        if (coinsInput === null) { console.log("❌ Cancelado."); return; }
        var coins = parseInt(coinsInput.trim());
        if (isNaN(coins) || coins < 0) { alert("❌ Monedas inválidas."); return; }

        var runeIdInput = prompt("🔮 [ADMIN] ID de la RUNA de recompensa (deja vacío si no tiene):");
        if (runeIdInput === null) { console.log("❌ Cancelado."); return; }
        var runeId = runeIdInput.trim() || "";

        var newCodeObj = { code: name, coins: coins, expiresAt: expiresAt };
        if (runeId) newCodeObj.runeId = runeId;

        var customCodes = [];
        try {
            var rawCC = localStorage.getItem('tom_cc_data');
            if (rawCC) customCodes = JSON.parse(atob(rawCC));
        } catch (e) { customCodes = []; }
        customCodes = customCodes.filter(function (c) { return c.code !== name; });
        customCodes.push(newCodeObj);
        try {
            localStorage.setItem('tom_cc_data', btoa(JSON.stringify(customCodes)));
        } catch (e) { console.error("❌ Error guardando código.", e); }
        window.CODES_DATA = _defaultCodes.concat(customCodes);

        var addCbName = 'addCodeCb_' + Math.round(Math.random() * 999999);
        var addScript = document.createElement('script');
        addScript.id = addCbName;
        addScript.src = window.leaderboardAPI + '?action=addCode&token=trial2026&code=' + encodeURIComponent(name) + '&coins=' + coins + '&expiresAt=' + encodeURIComponent(expiresAt) + '&runeId=' + encodeURIComponent(runeId) + '&callback=' + addCbName + '&t=' + Date.now();
        window[addCbName] = function (resp) {
            delete window[addCbName];
            var el = document.getElementById(addCbName);
            if (el) el.remove();
            if (resp && resp.success) {
                console.log('☁️ Código sincronizado con el servidor.');
            } else {
                console.warn('⚠️ No se pudo guardar en el servidor:', resp ? resp.error : 'sin respuesta');
            }
        };
        addScript.onerror = function () { delete window[addCbName]; addScript.remove(); console.warn('⚠️ Error de red al guardar código en el servidor.'); };
        document.body.appendChild(addScript);

        _adminOk('Código "' + name + '" creado. 🎁 ' + coins + ' coins | 📅 ' + expiresAt);
    }


    Object.defineProperty(window, 'score', {
        get: function () {
            var el = document.getElementById('score');
            return el ? parseInt(el.textContent) || 0 : 0;
        },
        set: function (v) {
            if (_adminLocked) { _adminDenied('puntos'); return; }
            var n = parseInt(v);
            if (isNaN(n)) { _adminDenied('puntos'); return; }
            var el = document.getElementById('score');
            if (el) el.textContent = n;
            try { window._gameScore = n; } catch (e) { }
            if (typeof Users !== 'undefined' && Users.data) Users.updateHighScore(n);
            _adminOk('score → ' + n);
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'saveLeader', {
        get: function () {
            if (_adminLocked) { _adminDenied('leaderboard'); return null; }
            var nameEl = document.getElementById('player-name-display');
            var scoreEl = document.getElementById('score');
            var name = (nameEl ? nameEl.textContent : null) || (typeof Users !== 'undefined' ? Users.current : 'Player') || 'Player';
            var s = parseInt(scoreEl ? scoreEl.textContent : 0) || 0;
            if (typeof Users !== 'undefined' && Users.data) {
                Users.updateHighScore(s);
                _adminOk('Leaderboard guardado — ' + name + ' → ' + s + ' pts');
            }
            return true;
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'addnota', {
        get: function () {
            if (_adminLocked) { _adminDenied('notas'); return "Acceso denegado."; }

            var modal = document.getElementById('admin-note-overlay');
            var innerModal = document.getElementById('admin-note-modal');
            if (modal && innerModal) {
                modal.style.display = 'flex';
                innerModal.style.display = 'flex';
                document.getElementById('admin-note-title').value = '';
                document.getElementById('admin-note-content').value = '';
                var anonBox = document.getElementById('btn-anon');
                if (anonBox) anonBox.checked = false;

                var btnCancelar = document.getElementById('btn-cancelar-nota');
                var btnGuardar = document.getElementById('btn-guardar-nota');

                btnCancelar.onclick = function () {
                    modal.style.display = 'none';
                    innerModal.style.display = 'none';
                };

                btnGuardar.onclick = function () {
                    var title = document.getElementById('admin-note-title').value.trim();
                    var content = document.getElementById('admin-note-content').value.trim();
                    var anonBox = document.getElementById('btn-anon');
                    var isAnon = anonBox && anonBox.checked;
                    var author = isAnon ? 'Anónimo' : ((typeof Users !== 'undefined' ? Users.current : 'Admin') || 'Admin');

                    if (!title || !content) {
                        alert("❌ Título y Contenido son obligatorios.");
                        return;
                    }

                    modal.style.display = 'none';
                    innerModal.style.display = 'none';
                    _adminOk('⏳ Guardando nota en la nube...');

                    var cbName = 'addNotaCb_' + Math.round(Math.random() * 999999);
                    var script = document.createElement('script');
                    script.id = cbName;
                    var apiUrl = window.CONFIG && window.CONFIG.NOTES_API_URL ? window.CONFIG.NOTES_API_URL : null;
                    if (!apiUrl) {
                        _adminOk('❌ ERROR: NOTES_API_URL no configurado.');
                        return;
                    }

                    script.src = apiUrl + '?action=addNote&token=trial2026' +
                        '&title=' + encodeURIComponent(title) +
                        '&content=' + encodeURIComponent(content) +
                        '&author=' + encodeURIComponent(author) +
                        '&callback=' + cbName + '&t=' + Date.now();

                    window[cbName] = function (resp) {
                        delete window[cbName];
                        var el = document.getElementById(cbName);
                        if (el) el.remove();
                        if (resp && resp.success) {
                            _adminOk('✅ ¡Nota guardada correctamente!');
                            if (typeof NotesSystem !== 'undefined') NotesSystem.cache = null;
                        } else {
                            _adminOk('❌ Error guardando nota: ' + (resp ? resp.error : ''));
                        }
                    };
                    script.onerror = function () {
                        delete window[cbName];
                        script.remove();
                        _adminOk('❌ Error de red al guardar nota.');
                    };
                    document.body.appendChild(script);
                };
            }
            return "📝 Abriendo editor de notas...";
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'coins', {
        get: function () {
            if (_adminLocked) { _adminDenied('monedas'); return null; }
            return typeof Users !== 'undefined' && Users.data ? Users.data.coins : null;
        },
        set: function (v) {
            if (_adminLocked) { _adminDenied('monedas'); return; }
            var str = String(v).trim();
            var parts = str.split(' ');
            var lastPart = parts[parts.length - 1];
            var amount, targetName;
            if (!isNaN(parseInt(lastPart))) {
                amount = parseInt(lastPart);
                targetName = parts.slice(0, -1).join(' ').trim() || null;
            } else {
                amount = parseInt(str); targetName = null;
            }
            if (isNaN(amount)) { _adminDenied('monedas'); return; }
            var name = targetName || (typeof Users !== 'undefined' ? Users.current : null) || 'Player';
            try {
                if (typeof Storage !== 'undefined' && typeof Storage.saveUser === 'function') {
                    var u = Storage.getUser(name);
                    u.coins = amount;
                    Storage.saveUser(name, u);
                } else {
                    var all = JSON.parse(localStorage.getItem('tom_users') || '{}');
                    if (!all[name]) all[name] = { coins: 0, highScore: 0, equippedBanner: null, ownedBanners: [], stats: {} };
                    all[name].coins = amount;
                    localStorage.setItem('tom_users', JSON.stringify(all));
                }
                if (typeof Users !== 'undefined' && Users.current === name) {
                    Users.data.coins = amount;
                    if (typeof Users._updateHUD === 'function') Users._updateHUD();
                    else if (typeof Users.updateUI === 'function') Users.updateUI();
                }
                _adminOk('coins → ' + name + ' : ' + amount);
            } catch (e) { console.error('Error coins:', e); }
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'modLeader', {
        get: function () { return _adminLocked ? (_adminDenied('puntos'), null) : 'ready'; },
        set: function (v) {
            if (_adminLocked) { _adminDenied('puntos'); return; }
            var str = String(v).trim();
            var parts = str.split(' ');
            var lastPart = parts[parts.length - 1];
            if (isNaN(parseInt(lastPart))) { _adminDenied('puntos'); return; }
            var amount = parseInt(lastPart);
            var name = parts.slice(0, -1).join(' ').trim();
            if (!name || isNaN(amount)) { _adminDenied('puntos'); return; }
            try {
                if (typeof Storage !== 'undefined' && typeof Storage.saveUser === 'function') {
                    var u = Storage.getUser(name);
                    u.highScore = amount;
                    Storage.saveUser(name, u);
                } else {
                    var all = JSON.parse(localStorage.getItem('tom_users') || '{}');
                    if (!all[name]) all[name] = { coins: 0, highScore: 0, equippedBanner: null, ownedBanners: [], stats: {} };
                    all[name].highScore = amount;
                    localStorage.setItem('tom_users', JSON.stringify(all));
                }
                if (typeof Users !== 'undefined' && Users.current === name) {
                    Users.data.highScore = amount;
                    if (typeof Users.updateUI === 'function') Users.updateUI();
                }
                _adminOk('modLeader → ' + name + ' score set to ' + amount);
            } catch (e) { console.error('modLeader failed', e); }
        },
        configurable: false, enumerable: false
    });

    Object.defineProperty(window, 'addCode', {
        get: function () { return _adminLocked ? (_adminDenied('codes'), null) : _addCodeFunc; },
        set: function (v) { if (_adminLocked) { _adminDenied('codes'); return; } _addCodeFunc(v); },
        configurable: false, enumerable: false
    });

    // =========================================================================
    // 13. LISTENER DE LEADERBOARD Y RETRY AL INICIO
    // =========================================================================
    document.addEventListener('click', function (e) {
        var id = e.target.id;
        if (id === 'view-leaderboard-start' || id === 'show-leaderboard-btn' || id === 'view-leaderboard-after-victory') {
            e.stopPropagation();
            window.showLeaderboard();
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        var viewStart = document.getElementById('view-leaderboard-start');
        var closeBtn = document.getElementById('close-leaderboard');
        var downloadBtn = document.getElementById('download-csv');
        var showBtn = document.getElementById('show-leaderboard-btn');

        if (viewStart) viewStart.addEventListener('click', function (e) { e.stopPropagation(); window.showLeaderboard(); });
        if (closeBtn) closeBtn.addEventListener('click', window.closeLeaderboardModal);
        if (downloadBtn) downloadBtn.addEventListener('click', window.downloadLeaderboardCSV);
        if (showBtn) showBtn.addEventListener('click', function (e) { e.stopPropagation(); window.showLeaderboard(); });

        var backdrop = document.getElementById('leaderboard-modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', function (e) { if (e.target === backdrop) window.closeLeaderboardModal(); });
        }

        var title = document.querySelector('h1');
        if (title) {
            title.style.cursor = 'pointer';
            title.addEventListener('dblclick', function () {
                var pass = prompt("🔑 [ADMIN] Enter password:");
                if (pass) window.adminLogin(pass);
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                var pass = prompt("🔑 [ADMIN] Enter password:");
                if (pass) window.adminLogin(pass);
            }
        });

        setTimeout(window.retrySendPending, 3000);
    });

    function _escapeHtml(s) {
        if (!s) return '';
        return s.replace(/[&<>"]/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]);
        });
    }
    window.escapeHtml = _escapeHtml;

})();
