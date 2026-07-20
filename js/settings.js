// =============================================================================
// SETTINGS — Trials of Mastery
// =============================================================================

// ---------------------------------------------------------------------------
// applySettings — Apply a settings object to the UI and audio elements.
// Exposed globally so it can be called from Users.load() after cloud sync.
// ---------------------------------------------------------------------------
window.applySettings = function (settings) {
    settings = settings || {};

    const musicEnabled = settings.musicEnabled !== undefined ? settings.musicEnabled : true;
    const vfxEnabled   = settings.vfxEnabled   !== undefined ? settings.vfxEnabled   : true;

    // Apply audio mute state
    document.querySelectorAll('audio').forEach(audio => {
        audio.muted = !musicEnabled;
    });

    // Update toggle button labels if they exist
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    if (toggleMusicBtn) {
        toggleMusicBtn.textContent       = musicEnabled ? 'ON' : 'OFF';
        toggleMusicBtn.style.background  = musicEnabled ? '#00f3ff' : '#003366';
        toggleMusicBtn.style.color       = musicEnabled ? '#003366' : '#fff';
    }

    const toggleVfxBtn = document.getElementById('toggle-vfx-btn');
    if (toggleVfxBtn) {
        toggleVfxBtn.textContent       = vfxEnabled ? 'ON' : 'OFF';
        toggleVfxBtn.style.background  = vfxEnabled ? '#00f3ff' : '#003366';
        toggleVfxBtn.style.color       = vfxEnabled ? '#003366' : '#fff';
    }
};

// ---------------------------------------------------------------------------
// _getSettings — Read settings from profile if logged in, else localStorage
// ---------------------------------------------------------------------------
function _getSettings() {
    if (typeof Users !== 'undefined' && Users.data && Users.data.settings) {
        return Users.data.settings;
    }
    return {
        musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
        vfxEnabled:   localStorage.getItem('vfxEnabled')   !== 'false'
    };
}

// ---------------------------------------------------------------------------
// _saveSettings — Write settings to profile (syncs to cloud) + localStorage
// ---------------------------------------------------------------------------
function _saveSettings(settings) {
    // Always persist in localStorage as fallback
    localStorage.setItem('musicEnabled', settings.musicEnabled);
    localStorage.setItem('vfxEnabled',   settings.vfxEnabled);

    // Persist in user profile if a user is logged in (syncs across devices)
    if (typeof Users !== 'undefined' && Users.data) {
        Users.data.settings = settings;
        Users.save();
    }
}

// ---------------------------------------------------------------------------
// DOMContentLoaded — Wire up settings UI
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn    = document.getElementById('settings-btn');
    const settingsOverlay = document.getElementById('settings-overlay');
    const closeSettings  = document.getElementById('close-settings');
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    const toggleVfxBtn   = document.getElementById('toggle-vfx-btn');

    const termsLink      = document.getElementById('terms-link');
    const termsOverlay   = document.getElementById('terms-overlay');
    const termsModal     = document.getElementById('terms-modal');
    const closeTerms     = document.getElementById('close-terms');
    const termsContainer = document.getElementById('terms-content-container');

    // Load terms
    if (termsContainer && typeof gameTermsAndConditions !== 'undefined') {
        termsContainer.innerHTML = gameTermsAndConditions + '<br><br><br>';
    }

    // Apply initial settings (profile may not be loaded yet; uses localStorage fallback)
    window.applySettings(_getSettings());

    // Settings panel open/close
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // Re-apply current settings when opening the panel so toggles are in sync
            window.applySettings(_getSettings());
            settingsOverlay.style.display = 'flex';
            settingsBtn.style.transform   = 'rotate(90deg)';
            setTimeout(() => { settingsBtn.style.transform = 'rotate(0deg)'; }, 200);
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            settingsOverlay.style.display = 'none';
        });
    }

    // Music toggle
    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', () => {
            const s = _getSettings();
            s.musicEnabled = !s.musicEnabled;
            _saveSettings(s);
            window.applySettings(s);
        });
    }

    // VFX toggle
    if (toggleVfxBtn) {
        toggleVfxBtn.addEventListener('click', () => {
            const s = _getSettings();
            s.vfxEnabled = !s.vfxEnabled;
            _saveSettings(s);
            window.applySettings(s);
        });
    }

    // Terms modal
    if (termsLink) {
        termsLink.addEventListener('click', () => {
            termsOverlay.style.display = 'flex';
            setTimeout(() => { termsModal.style.height = '75vh'; }, 10);
        });
    }

    const hideTerms = () => {
        termsModal.style.height = '0';
        setTimeout(() => { termsOverlay.style.display = 'none'; }, 400);
    };

    if (closeTerms) closeTerms.addEventListener('click', hideTerms);
    if (termsOverlay) {
        termsOverlay.addEventListener('click', e => { if (e.target === termsOverlay) hideTerms(); });
    }
});
