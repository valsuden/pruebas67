// js/multiplayer.js

const Multiplayer = {
    pollingInterval: null,

    init() {
        if (!window.leaderboardAPI) return;

        this.pollingInterval = setInterval(() => {
            this.checkAttacks();
        }, 8000); // Polling every 8s to reduce load
    },

    stop() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    },

    sendAttack(attacker, target, runeId) {
        if (!window.leaderboardAPI || !attacker || !target || !runeId) return;

        const cbName = 'sendRuneCb_' + Date.now() + Math.floor(Math.random() * 1000);
        window[cbName] = function (data) {
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();
            
            if (data && data.success) {
                if (typeof applyAttackBenefits === 'function') applyAttackBenefits(runeId, target);
                if (typeof window.fetchProfileFromCloud === 'function') window.fetchProfileFromCloud(attacker);
            } else if (data) {
                if (typeof showRuneAlert === 'function') showRuneAlert("Falló: " + data.error, "#ff0000");
            }
        };

        const hash = window.generateHash ? window.generateHash(attacker + target + runeId, '', '') : '';
        const s = document.createElement('script');
        s.id = cbName;
        s.src = window.leaderboardAPI + '?action=sendAttack&attacker=' + encodeURIComponent(attacker) + '&target=' + encodeURIComponent(target) + '&runeId=' + encodeURIComponent(runeId) + '&hash=' + hash + '&callback=' + cbName + '&t=' + Date.now();
        document.body.appendChild(s);
    },

    checkAttacks() {
        if (typeof Users === 'undefined' || !Users.current || !window.leaderboardAPI) return;

        const cbName = 'runeAttackCb_' + Date.now() + Math.floor(Math.random() * 1000);
        window[cbName] = function (data) {
            if (data && data.success && data.attacks && data.attacks.length > 0) {
                data.attacks.forEach(attack => {
                    if (typeof receiveRuneAttack === 'function') {
                        receiveRuneAttack(attack.attacker, attack.runeId);
                    }
                    Multiplayer.clearAttack(attack.id);
                });
                
                // Immediately sync profile to reflect server-side point/coin damage
                if (typeof window.fetchProfileFromCloud === 'function') {
                    window.fetchProfileFromCloud(Users.current);
                }
            }
            delete window[cbName];
            const script = document.getElementById(cbName);
            if (script) script.remove();
        };

        const s = document.createElement('script');
        s.id = cbName;
        s.src = window.leaderboardAPI + '?action=getAttacks&name=' + encodeURIComponent(Users.current) + '&callback=' + cbName + '&t=' + Date.now();
        document.body.appendChild(s);
    },

    clearAttack(attackId) {
        if (!window.leaderboardAPI) return;
        var formData = new URLSearchParams();
        formData.append('action', 'clearAttack');
        formData.append('attackId', attackId);

        fetch(window.leaderboardAPI, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        }).catch(function () {});
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Multiplayer.init();
});
