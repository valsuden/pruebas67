// js/rune_effects.js

// Function to display alerts for rune effects
window.showRuneAlert = function(message, color) {
    if (typeof toast === 'function') {
        // Use existing toast system if available, passing custom color logic or defaulting to success/error
        toast(message, color === '#ff3300' || color === '#ff0000' ? 'error' : 'success');
        
        // Also show a custom floating text alert in the game area if active
        if (typeof Game !== 'undefined' && Game.isPlaying) {
            const gameContainer = document.getElementById('game');
            if (gameContainer) {
                const floatingText = document.createElement('div');
                floatingText.textContent = message;
                floatingText.style.position = 'absolute';
                floatingText.style.color = color || '#ffffff';
                floatingText.style.top = '20%';
                floatingText.style.left = '50%';
                floatingText.style.transform = 'translate(-50%, -50%)';
                floatingText.style.fontSize = '1.2em';
                floatingText.style.fontWeight = 'bold';
                floatingText.style.textShadow = '0 0 10px rgba(0,0,0,0.8), 0 0 20px ' + (color || '#ffffff');
                floatingText.style.zIndex = '9999';
                floatingText.style.pointerEvents = 'none';
                floatingText.style.animation = 'floatUpRune 2s forwards';
                gameContainer.appendChild(floatingText);
                
                if (!document.getElementById('rune-float-style')) {
                    const style = document.createElement('style');
                    style.id = 'rune-float-style';
                    style.textContent = '@keyframes floatUpRune { 0% { opacity: 0; transform: translate(-50%, -30%); } 10% { opacity: 1; transform: translate(-50%, -50%); } 80% { opacity: 1; transform: translate(-50%, -80%); } 100% { opacity: 0; transform: translate(-50%, -100%); } }';
                    document.head.appendChild(style);
                }
                
                setTimeout(() => floatingText.remove(), 2000);
            }
        }
    } else {
        console.log("%c Rune Alert: " + message, "color: " + color);
    }
};

window.RuneState = {
    doublePointsUntil: 0,
    triplePointsUntil: 0,
    quickMindUntil: 0,
    safeStepActive: false,
    shieldActive: false,
    lockdownActive: false,
    silenceActive: false,
    scoreEchoActive: false,
    guardianUntil: 0,
    reflectActive: false,
    blockStreakGain: false,
    leaderSealActive: false,
    pressureActive: false,
    smallBoostActive: false,
    coinBonus: 0,
    timeLockedUntil: 0,
    randomMultiplierUntil: 0,
    currentMultiplier: 1
};

window.resetRuneState = function() {
    // Mantener guardianUntil si aún es válido
    const currentGuardian = window.RuneState ? window.RuneState.guardianUntil : 0;
    
    window.RuneState = {
        doublePointsUntil: 0,
        triplePointsUntil: 0,
        quickMindUntil: 0,
        safeStepActive: false,
        shieldActive: false,
        lockdownActive: false,
        silenceActive: false,
        scoreEchoActive: false,
        guardianUntil: currentGuardian, // Conservar el guardián porque dura 24h
        reflectActive: false,
        blockStreakGain: false,
        leaderSealActive: false,
        pressureActive: false,
        smallBoostActive: false,
        coinBonus: 0,
        timeLockedUntil: 0,
        randomMultiplierUntil: 0,
        currentMultiplier: 1
    };
};

function applyRune(runeId) {
    if (!Users.data) return false;

    const target = window.currentRuneTarget;
    window.currentRuneTarget = null; // reset

    // If silenced, cannot use runes
    if (RuneState.silenceActive) {
        showRuneAlert("No puedes usar runas, estás silenciado.", "#ff0000");
        return false;
    }
    
    if (RuneState.lockdownActive) {
        showRuneAlert("Tu runa ha sido bloqueada por Lockdown.", "#ff0000");
        RuneState.lockdownActive = false; // consumes lockdown
        return true; // Rune consumed but effect cancelled
    }

    const r = getRune(runeId);
    if (!r) return false;

    const gameActive = typeof Game !== 'undefined' && Game.isPlaying;
    if (r.category === 'Gameplay' && !gameActive) {
        showRuneAlert("¡Esta runa solo se puede usar durante una partida!", "#ff6600");
        return false; // Rune NOT consumed
    }
    
    if ((r.category === 'Attack' || r.category === 'Defense') && gameActive) {
        showRuneAlert("¡No puedes usar runas de Ataque/Defensa mientras juegas!", "#ff6600");
        return false; // Rune NOT consumed
    }

    // Common effects
    if (runeId === 'rune_focus') {
        if (typeof Game !== 'undefined') Game.timeLeft += 10;
        showRuneAlert("⏳ Rune of Focus — +10 segundos al tiempo.", "#a0e0ff");
        return true;
    }
    if (runeId === 'rune_recovery') {
        if (typeof Game !== 'undefined') Game.magicEnergy = Math.min(5, Game.magicEnergy + 1);
        if (typeof UI !== 'undefined' && UI.updateEnergyDisplay) UI.updateEnergyDisplay(Game.magicEnergy);
        showRuneAlert("❤️ Rune of Recovery — Recuperaste 1 vida.", "#ff6688");
        return true;
    }
    if (runeId === 'rune_shield') {
        RuneState.shieldActive = true;
        showRuneAlert("🛡️ Rune of Shield — Tu próximo ataque será bloqueado.", "#00ccff");
        return true;
    }
    if (runeId === 'rune_wisdom') {
        if (typeof Game !== 'undefined' && Game.isPlaying) {
            const currentAnswers = (typeof levels !== 'undefined' && levels[Game.currentLevel]) ? levels[Game.currentLevel].words[Game.currentWord] : null;
            if (currentAnswers && currentAnswers.length > 0) {
                const firstLetter = currentAnswers[0].charAt(0).toUpperCase();
                const ansInput = document.getElementById('answer');
                if (ansInput && !ansInput.value) {
                    ansInput.value = firstLetter;
                }
                showRuneAlert(`👁️ Rune of Wisdom — La palabra comienza con '${firstLetter}'.`, "#ffe066");
            } else {
                showRuneAlert("👁️ Rune of Wisdom — El conocimiento ilumina el camino.", "#ffe066");
            }
        } else {
             showRuneAlert("👁️ Rune of Wisdom — El conocimiento ilumina el camino.", "#ffe066");
        }
        return true;
    }
    if (runeId === 'rune_calm') {
        RuneState.safeStepActive = true;
        showRuneAlert("🧘 Rune of Calm — Tu próximo error no romperá el streak.", "#99ffcc");
        return true;
    }
    if (runeId === 'rune_coin_spark') {
        RuneState.coinBonus = Math.min(2.0, RuneState.coinBonus + 0.25);
        showRuneAlert("✨ Rune of Coin Spark — +25% de coins al terminar.", "#ffd700");
        return true;
    }
    if (runeId === 'rune_small_boost') {
        RuneState.smallBoostActive = true;
        showRuneAlert("📈 Rune of Small Boost — La siguiente respuesta da +1 punto extra.", "#ccffaa");
        return true;
    }
    if (runeId === 'rune_purify') {
        RuneState.silenceActive = false;
        RuneState.lockdownActive = false;
        RuneState.leaderSealActive = false;
        RuneState.pressureActive = false;
        showRuneAlert("💧 Rune of Purify — Todos los efectos negativos eliminados.", "#aaffee");
        return true;
    }

    // Rare runes
    if (runeId === 'rune_double') {
        RuneState.doublePointsUntil = Date.now() + 30000;
        showRuneAlert("x2 Rune of Double — ¡Puntos dobles por 30 segundos!", "#ff9900");
        return true;
    }
    if (runeId === 'rune_combo') {
        if (typeof Game !== 'undefined') {
            Game.currentStreak = Math.max(Game.currentStreak, 2);
            if (typeof Game.updateStreakVisuals === 'function') Game.updateStreakVisuals();
        }
        showRuneAlert("🔥 Rune of Combo — ¡Streak iniciado en x2!", "#ff4400");
        return true;
    }
    if (runeId === 'rune_time_lock') {
        RuneState.timeLockedUntil = Date.now() + 15000;
        showRuneAlert("⏸️ Rune of Time Lock — El tiempo está congelado por 15 segundos.", "#66eeff");
        return true;
    }
    if (runeId === 'rune_stamina') {
        if (typeof Game !== 'undefined') Game.magicEnergy = Math.min(5, Game.magicEnergy + 2);
        if (typeof UI !== 'undefined' && UI.updateEnergyDisplay) UI.updateEnergyDisplay(Game.magicEnergy);
        showRuneAlert("💪 Rune of Stamina — Recuperaste 2 vidas.", "#ff6688");
        return true;
    }
    if (runeId === 'rune_quick_mind') {
        RuneState.quickMindUntil = Date.now() + 20000;
        showRuneAlert("⚡ Rune of Quick Mind — +1 punto extra por respuesta correcta (20s).", "#ffff44");
        return true;
    }
    if (runeId === 'rune_safe_step') {
        RuneState.safeStepActive = true;
        showRuneAlert("🛡️ Rune of Safe Step — Tu próximo error no te quita vida.", "#99ffcc");
        return true;
    }
    if (runeId === 'rune_coin_burst') {
        RuneState.coinBonus = Math.min(2.0, RuneState.coinBonus + 1.0);
        showRuneAlert("💰 Rune of Coin Burst — Gran bono de coins al terminar la partida.", "#ffd700");
        return true;
    }
    if (runeId === 'rune_lucky_roll') {
        const multipliers = [1.5, 2, 3];
        const randomMult = multipliers[Math.floor(Math.random() * multipliers.length)];
        RuneState.randomMultiplierUntil = Date.now() + 15000;
        RuneState.currentMultiplier = randomMult;
        showRuneAlert(`🎲 Rune of Lucky Roll — Multiplicador aleatorio x${randomMult} por 15s.`, "#cc88ff");
        return true;
    }
    if (runeId === 'rune_score_echo') {
        RuneState.scoreEchoActive = true;
        showRuneAlert("🦇 Rune of Score Echo — Absorberás daño del próximo ataque.", "#aa00ff");
        return true;
    }
    if (runeId === 'rune_pressure') {
        RuneState.pressureActive = true;
        showRuneAlert("🎯 Rune of Pressure — Cada acierto tuyo le restará tiempo al líder.", "#ff44aa");
        return true;
    }

    // Legendary y Mythic Buffs
    if (runeId === 'rune_guardian') {
        RuneState.guardianUntil = Date.now() + 86400000; // 24h
        showRuneAlert("🛡️ Guardian Rune — Estás protegido de ataques por 24 horas.", "#ffd700");
        return true;
    }
    if (runeId === 'rune_reflect') {
        RuneState.reflectActive = true;
        showRuneAlert("🪞 Reflect Rune — Reflejarás el próximo ataque.", "#ffaa00");
        return true;
    }
    if (runeId === 'rune_overdrive') {
        RuneState.triplePointsUntil = Date.now() + 30000;
        showRuneAlert("🔥 Rune of Overdrive — ¡Puntos triples por 30 segundos!", "#ff0000");
        return true;
    }
    if (runeId === 'rune_emperor') {
        if (typeof Game !== 'undefined') {
            Game.score += 15;
            Game.magicEnergy = Math.min(5, Game.magicEnergy + 2);
            if (typeof Game.updateUI === 'function') Game.updateUI();
        }
        showRuneAlert("👑 Rune of Emperor — +15 pts y +2 vidas.", "#ffd700");
        return true;
    }
    if (runeId === 'rune_crown_breaker') {
        if (typeof Game !== 'undefined' && typeof Storage !== 'undefined') {
            const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
            const leader = lb[0];
            if (leader && leader.name !== Users.current) {
                Game.score = leader.score + 10;
                if (typeof Game.updateUI === 'function') Game.updateUI();
                showRuneAlert(`👑 Rune of Crown Breaker — Superaste el puntaje de ${leader.name}.`, "#ff8800");
            } else {
                showRuneAlert("👑 Rune of Crown Breaker — Ya eres el líder.", "#ff8800");
            }
        }
        return true;
    }
    if (runeId === 'rune_fate_rewind') {
        if (typeof Game !== 'undefined') {
            Game.magicEnergy = 5;
            Game.timeLeft = (typeof levels !== 'undefined' && levels[Game.currentLevel]) ? levels[Game.currentLevel].time : 60;
            Game.currentStreak = 0;
            RuneState.blockStreakGain = true;
            if (typeof Game.updateUI === 'function') Game.updateUI();
        }
        showRuneAlert("⏪ Rune of Fate Rewind — Vida y tiempo restaurados. Streak bloqueado.", "#ff5555");
        return true;
    }
    if (runeId === 'rune_reality_shift') {
        if (typeof Game !== 'undefined' && typeof Storage !== 'undefined') {
            const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
            const leader = lb[0];
            if (leader && leader.name !== Users.current) {
                Game.score = leader.score;
                if (typeof Game.updateUI === 'function') Game.updateUI();
                showRuneAlert(`🌌 Rune of Reality Shift — Intercambiaste score con ${leader.name}.`, "#ff0000");
            } else {
                showRuneAlert("🌌 Rune of Reality Shift — Ya eres el líder.", "#ff0000");
            }
        }
        return true;
    }

    // Secret Rune
    if (runeId === 'rune_two_time') {
        if (typeof Game !== 'undefined') {
            Game.magicEnergy = 5;
            Game.timeLeft = 60;
            Game.currentStreak = 0;
            
            if (typeof UI !== 'undefined' && UI.updateEnergyDisplay) UI.updateEnergyDisplay(Game.magicEnergy);
            if (typeof UI !== 'undefined') UI.updateTimer(Game.timeLeft, false);
            
            // Remove all negative effects
            RuneState.silenceActive = false;
            RuneState.lockdownActive = false;
            RuneState.leaderSealActive = false;
            RuneState.pressureActive = false;
            RuneState.timeLockedUntil = 0;
            RuneState.blockStreakGain = true;
            
            if (typeof Game.updateUI === 'function') Game.updateUI();
        }

        // Cinematic alert
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed; inset: 0; z-index: 99999;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: radial-gradient(ellipse at center, #001a00 0%, #000000 100%);
            animation: twoTimeFadeIn 0.5s ease forwards;
            pointer-events: none;
        `;
        banner.innerHTML = `
            <style>
                @keyframes twoTimeFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes twoTimeFadeOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes glowPulse { 0%,100% { text-shadow: 0 0 20px #00ff44, 0 0 60px #00ff44; } 50% { text-shadow: 0 0 60px #00ff44, 0 0 120px #00ff44, 0 0 200px #00ff44; } }
            </style>
            <div style="font-size:clamp(1.5rem,5vw,3.5rem); color:#00ff44; font-family:'Courier New',monospace; letter-spacing:0.2em; animation: glowPulse 1s ease infinite; text-align:center; padding: 0 1rem;">
                🌌 THE SPAWN HAS SPOKEN 🌌
            </div>
            <div style="font-size:clamp(0.8rem,2.5vw,1.4rem); color:#aaffcc; font-family:'Courier New',monospace; margin-top:1.5rem; letter-spacing:0.1em; text-align:center; padding: 0 1rem; opacity:0.85;">
                You have been given a second chance.<br>Do not waste it.
            </div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => {
            banner.style.animation = 'twoTimeFadeOut 0.8s ease forwards';
            setTimeout(() => banner.remove(), 800);
        }, 2800);

        return true;
    }

    // Default return true if consumed
    return true;
}

// ============================================================================
// applyAttackBenefits — Applies local visual feedback when an attack succeeds
// Called from Multiplayer.sendAttack callback after GAS confirms success.
// ============================================================================
window.applyAttackBenefits = function(runeId, target) {
    if (typeof Game !== 'undefined' && Game.isPlaying) {
        if (runeId === 'rune_point_drain') {
            Game.score += 5;
        } else if (runeId === 'rune_stolen_crown') {
            Game.score += 10;
            if (typeof Storage !== 'undefined') {
                const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
                const tData = lb.find(p => p.name === target);
                if (tData) {
                    Game.currentStreak = tData.streak || 0;
                    if (typeof Game.updateStreakVisuals === 'function') Game.updateStreakVisuals();
                }
            }
        } else if (runeId === 'rune_shadow_copy') {
            if (typeof Storage !== 'undefined') {
                const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
                const tData = lb.find(p => p.name === target);
                if (tData && tData.score > Game.score) {
                    Game.score = tData.score;
                }
            }
        } else if (runeId === 'rune_position_swap' || runeId === 'rune_reality_shift') {
            if (typeof Storage !== 'undefined') {
                const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
                const tData = lb.find(p => p.name === target);
                if (tData) {
                    Game.score = tData.score;
                }
            }
        } else if (runeId === 'rune_crown_breaker') {
            if (typeof Storage !== 'undefined') {
                const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
                const tData = lb.find(p => p.name === target);
                if (tData) {
                    Game.score = tData.score + 10;
                }
            }
        } else if (runeId === 'rune_pressure') {
            RuneState.pressureActive = true;
            RuneState.pressureTarget = target;
        }
        if (typeof Game.updateUI === 'function') Game.updateUI();
    }

    const attackMessages = {
        'rune_point_drain':    `🧛 Rune of Point Drain — Drenaste 5 puntos de ${target}.`,
        'rune_streak_break':   `💔 Rune of Streak Break — Destruiste el streak de ${target}.`,
        'rune_silence':        `🤐 Rune of Silence — ${target} no puede usar runas.`,
        'rune_time_curse':     `⏰ Rune of Time Curse — Quitaste 10 segundos a ${target}.`,
        'rune_lockdown':       `🔒 Rune of Lockdown — Bloqueaste la próxima runa de ${target}.`,
        'rune_shadow_copy':    `🌑 Rune of Shadow Copy — Copiaste el poder de ${target}.`,
        'rune_position_swap':  `🔀 Rune of Position Swap — ¡Intercambiaste posición con ${target}!`,
        'rune_stolen_crown':   `👑 Rune of Stolen Crown — Robaste el liderazgo de ${target}.`,
        'rune_leader_seal':    `🏺 Rune of Leader Seal — Sellaste la puntuación de ${target}.`,
        'rune_crown_breaker':  `👑 Rune of Crown Breaker — Superaste a ${target}.`,
        'rune_reality_shift':  `🌌 Rune of Reality Shift — Intercambiaste con ${target}!`,
        'rune_pressure':       `🎯 Rune of Pressure — Presionando a ${target}.`
    };
    showRuneAlert(attackMessages[runeId] || `Atacaste a ${target}.`, "#ff3300");
};

// Function to handle receiving an attack
function receiveRuneAttack(attacker, runeId) {
    if (RuneState.guardianUntil > Date.now() || RuneState.shieldActive) {
        if (RuneState.shieldActive) RuneState.shieldActive = false;
        showRuneAlert(`Bloqueaste un ataque de ${attacker}`, "#00ffcc");
        return;
    }

    if (RuneState.reflectActive) {
        RuneState.reflectActive = false;
        if (typeof Multiplayer !== 'undefined') {
            Multiplayer.sendAttack(Users.current, attacker, runeId);
            showRuneAlert(`Reflejaste el ataque de ${attacker}`, "#ffcc00");
        }
        return;
    }

    const r = getRune(runeId);
    showRuneAlert(`${attacker} usó ${r ? r.name : 'una runa'} contra ti.`, "#ff3300");

    if (runeId === 'rune_point_drain') {
        let dmg = 5;
        if (RuneState.scoreEchoActive) {
            dmg = Math.floor(dmg / 2);
            if (typeof Game !== 'undefined') Game.score += dmg;
            RuneState.scoreEchoActive = false; // consume el escudo
            showRuneAlert(`Score Echo absorbió el ataque. Ganaste ${dmg} pts.`, "#aa00ff");
        } else {
            if (typeof Game !== 'undefined') Game.score = Math.max(0, Game.score - dmg);
        }
    } else if (runeId === 'rune_streak_break') {
        if (typeof Game !== 'undefined') {
            Game.currentStreak = 0;
            if (typeof Game.removeStreakVisuals === 'function') Game.removeStreakVisuals();
        }
    } else if (runeId === 'rune_silence') {
        RuneState.silenceActive = true;
    } else if (runeId === 'rune_time_curse') {
        if (typeof Game !== 'undefined') Game.timeLeft = Math.max(0, Game.timeLeft - 10);
    } else if (runeId === 'rune_lockdown') {
        RuneState.lockdownActive = true;
    } else if (runeId === 'rune_stolen_crown') {
        let dmg = 10;
        if (RuneState.scoreEchoActive) {
            dmg = Math.floor(dmg / 2);
            if (typeof Game !== 'undefined') Game.score += dmg;
            RuneState.scoreEchoActive = false;
             showRuneAlert(`Score Echo absorbió el ataque. Ganaste ${dmg} pts.`, "#aa00ff");
        } else {
             if (typeof Game !== 'undefined') {
                 Game.score = Math.max(0, Game.score - dmg);
                 Game.currentStreak = 0;
                 if (typeof Game.removeStreakVisuals === 'function') Game.removeStreakVisuals();
             }
        }
    } else if (runeId === 'rune_leader_seal') {
        RuneState.leaderSealActive = true;
    } else if (runeId === 'rune_position_swap' || runeId === 'rune_reality_shift') {
        if (typeof Game !== 'undefined' && typeof Storage !== 'undefined') {
            const lb = Storage.getLeaderboard ? Storage.getLeaderboard() : [];
            const attackerData = lb.find(p => p.name === attacker);
            if (attackerData) {
                Game.score = attackerData.score;
            }
        }
    }
    
    if (typeof Game !== 'undefined' && typeof Game.updateUI === 'function') {
        Game.updateUI();
    }
}
