// =============================================================================
// SECURITY SYSTEM — Trials of Mastery
// =============================================================================

class SecuritySystem {
    constructor() {
        this.salt = (window.CONFIG && window.CONFIG.SECURITY_SALT_COINS) || "ArcaneMastery2026_X";
        this.version = (window.CONFIG && window.CONFIG.GAME_VERSION) || "2.5.0";
    }

    _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString();
    }

    sanitize(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // -------------------------------------------------------------------------
    // reportCheat — Send a cheat report to Google Sheets "Tramposos"
    // -------------------------------------------------------------------------
    reportCheat({ cheatType = 'unknown', reason = '', alteredValue = '', evidence = '' } = {}) {
        // Avoid spamming: throttle same cheat type to once per 10 seconds
        const throttleKey = '_lastCheat_' + cheatType;
        const lastSent    = parseInt(sessionStorage.getItem(throttleKey) || '0');
        if (Date.now() - lastSent < 10000) return;
        sessionStorage.setItem(throttleKey, Date.now().toString());

        // Collect device information
        const ua  = navigator.userAgent || '';
        const os  = this._detectOS(ua);

        // Player name (best effort)
        const playerName = (typeof Users !== 'undefined' && Users.current)
            ? Users.current
            : (localStorage.getItem('savedPlayerName') || 'Unknown');

        // Log locally too
        const localRecord = {
            type:  cheatType, reason, alteredValue,
            date:  new Date().toISOString(), id: 'CHT-' + Date.now()
        };
        try {
            if (typeof Users !== 'undefined' && Users.data) {
                Users.data.cheatFlags = Users.data.cheatFlags || [];
                Users.data.cheatFlags.push(localRecord);
                if (typeof Storage !== 'undefined' && Storage.saveUser) {
                    Storage.saveUser(playerName, Users.data);
                }
            }
        } catch (_) {}

        // Send to server via JSONP (fire-and-forget)
        if (window.leaderboardAPI) {
            try {
                const cbName    = '_cheatCb_' + Date.now();
                const script    = document.createElement('script');
                const params    = new URLSearchParams({
                    action:       'reportCheat',
                    player:       playerName,
                    cheatType:    cheatType,
                    reason:       reason,
                    alteredValue: String(alteredValue).slice(0, 200),
                    evidence:     String(evidence).slice(0, 500),
                    userAgent:    ua.slice(0, 300),
                    os:           os,
                    version:      this.version,
                    callback:     cbName,
                    t:            Date.now()
                });
                
                if (window.generateHash) {
                    params.append('hash', window.generateHash(playerName, cheatType, ""));
                }
                
                window[cbName] = function () {
                    delete window[cbName];
                    if (script.parentNode) script.remove();
                };
                script.src = window.leaderboardAPI + '?' + params.toString();
                document.body.appendChild(script);
            } catch (_) {}
        }

        console.warn('%c 🚨 CHEAT DETECTED: ' + cheatType,
            'background:#ff0000;color:#fff;font-size:14px;padding:4px 10px;border-radius:3px;',
            reason);
    }

    _detectOS(ua) {
        if (/Windows NT 10/.test(ua)) return 'Windows 10/11';
        if (/Windows NT 6\.1/.test(ua)) return 'Windows 7';
        if (/Windows/.test(ua)) return 'Windows';
        if (/Mac OS X/.test(ua)) return 'macOS';
        if (/Android/.test(ua)) return 'Android';
        if (/iPhone|iPad/.test(ua)) return 'iOS';
        if (/Linux/.test(ua)) return 'Linux';
        return 'Unknown';
    }
}

const Security = new SecuritySystem();

// Expose globally for use in storage.js and elsewhere
window.reportCheat = function (opts) { Security.reportCheat(opts); };
