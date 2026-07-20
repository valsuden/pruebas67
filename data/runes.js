// =============================================================================
// DATOS DE LAS RUNAS (RELIQUIAS) Y SUS RAREZAS
// =============================================================================

const RUNES = [
    // COMMON RUNES (100 coins)
    {
        id: 'rune_focus',
        category: 'Gameplay',
        name: 'Rune of Focus',
        description: 'A calm mind always finds the answer. (+10 seconds)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '⏳'
    },
    {
        id: 'rune_recovery',
        category: 'Gameplay',
        name: 'Rune of Recovery',
        description: 'One mistake is not the end. (Recover 1 life)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '❤️'
    },
    {
        id: 'rune_shield',
        category: 'Defense',
        name: 'Rune of Shield',
        description: 'The barrier stands firm. (Blocks the next negative effect)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '🛡️'
    },
    {
        id: 'rune_wisdom',
        category: 'Gameplay',
        name: 'Rune of Wisdom',
        description: 'Knowledge leaves clues. (Reveal one letter)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '👁️'
    },
    {
        id: 'rune_calm',
        category: 'Gameplay',
        name: 'Rune of Calm',
        description: 'Stay focused. (One wrong answer does not break your streak)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '🧘'
    },
    {
        id: 'rune_coin_spark',
        category: 'Gameplay',
        name: 'Rune of Coin Spark',
        description: 'Small fortunes grow. (+25% coins at match end)',
        rarity: 'Common',
        price: 120,
        css: 'rn-common',
        glyph: '✨'
    },
    {
        id: 'rune_small_boost',
        category: 'Gameplay',
        name: 'Rune of Small Boost',
        description: 'Every point matters. (Next correct answer grants +1 extra point)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '📈'
    },
    {
        id: 'rune_purify',
        category: 'Gameplay',
        name: 'Rune of Purify',
        description: 'Darkness fades. (Removes one active negative effect)',
        rarity: 'Common',
        price: 100,
        css: 'rn-common',
        glyph: '💧'
    },

    // RARE RUNES (250 coins)
    {
        id: 'rune_double',
        category: 'Gameplay',
        name: 'Rune of Double',
        description: 'Twice the reward. (Double points for 30 seconds)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: 'x2'
    },
    {
        id: 'rune_combo',
        category: 'Gameplay',
        name: 'Rune of Combo',
        description: 'Momentum creates champions. (Start with x2 streak)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: '🔥'
    },
    {
        id: 'rune_time_lock',
        category: 'Gameplay',
        name: 'Rune of Time Lock',
        description: 'The clock obeys. (Freeze time for 15 seconds)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: '⏸️'
    },
    {
        id: 'rune_stamina',
        category: 'Gameplay',
        name: 'Rune of Stamina',
        description: 'Endurance wins battles. (Recover 2 lives)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: '💪'
    },
    {
        id: 'rune_lucky_roll',
        category: 'Gameplay',
        name: 'Rune of Lucky Roll',
        description: 'Fortune favors the bold. (Increased chance of a random multiplier)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: '🎲'
    },
    {
        id: 'rune_quick_mind',
        category: 'Gameplay',
        name: 'Rune of Quick Mind',
        description: 'Speed becomes power. (+1 extra point per correct answer for 20 seconds)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: '⚡'
    },
    {
        id: 'rune_safe_step',
        category: 'Gameplay',
        name: 'Rune of Safe Step',
        description: 'One free mistake. (Next mistake does not remove a life)',
        rarity: 'Rare',
        price: 250,
        css: 'rn-rare',
        glyph: '🛡️'
    },
    {
        id: 'rune_coin_burst',
        category: 'Gameplay',
        name: 'Rune of Coin Burst',
        description: 'Profit from knowledge. (Large coin bonus after the match)',
        rarity: 'Rare',
        price: 300,
        css: 'rn-rare',
        glyph: '💰'
    },

    // EPIC RUNES (600 coins)
    {
        id: 'rune_point_drain',
        category: 'Attack',
        name: 'Rune of Point Drain',
        description: 'Power changes hands. (Steal 5 points from a target player)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '🧛',
        targeted: true
    },
    {
        id: 'rune_streak_break',
        category: 'Attack',
        name: 'Rune of Streak Break',
        description: 'Every streak eventually ends. (Destroy the target\'s streak)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '💔',
        targeted: true
    },
    {
        id: 'rune_silence',
        category: 'Attack',
        name: 'Rune of Silence',
        description: 'Magic sealed. (Target cannot use runes during the next match)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '🤐',
        targeted: true
    },
    {
        id: 'rune_time_curse',
        category: 'Attack',
        name: 'Rune of Time Curse',
        description: 'The clock becomes your enemy. (Remove 10 seconds from a target)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '⏰',
        targeted: true
    },
    {
        id: 'rune_lockdown',
        category: 'Attack',
        name: 'Rune of Lockdown',
        description: 'Your power is sealed. (Blocks the next rune used by a target)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '🔒',
        targeted: true
    },
    {
        id: 'rune_score_echo',
        category: 'Defense',
        name: 'Rune of Score Echo',
        description: 'Pain becomes strength. (Gain 50% of points lost from incoming attacks)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '🦇'
    },
    {
        id: 'rune_pressure',
        category: 'Attack',
        name: 'Rune of Pressure',
        description: 'The hunt begins. (Target loses 1 second whenever you answer correctly for the next minute)',
        rarity: 'Epic',
        price: 600,
        css: 'rn-epic',
        glyph: '🎯',
        targeted: true
    },
    {
        id: 'rune_shadow_copy',
        category: 'Attack',
        name: 'Rune of Shadow Copy',
        description: 'Walk beside greatness. (Copy the score of another player without stealing it)',
        rarity: 'Epic',
        price: 700,
        css: 'rn-epic',
        glyph: '👥',
        targeted: true
    },

    // LEGENDARY RUNES (1500 coins)
    {
        id: 'rune_crown_breaker',
        category: 'Attack',
        name: 'Rune of Crown Breaker',
        description: 'The crown changes owners. (Become 10 points above the target)',
        rarity: 'Legendary',
        price: 1600,
        css: 'rn-legendary',
        glyph: '👑',
        targeted: true
    },
    {
        id: 'rune_position_swap',
        category: 'Attack',
        name: 'Rune of Position Swap',
        description: 'Fate changes places. (Swap leaderboard positions with a selected player)',
        rarity: 'Legendary',
        price: 1500,
        css: 'rn-legendary',
        glyph: '🔄',
        targeted: true
    },
    {
        id: 'rune_time_freeze',
        category: 'Gameplay',
        name: 'Rune of Time Freeze',
        description: 'For a moment, time stops. (Freeze time for 30 seconds)',
        rarity: 'Legendary',
        price: 1500,
        css: 'rn-legendary',
        glyph: '🧊'
    },
    {
        id: 'rune_stolen_crown',
        category: 'Attack',
        name: 'Rune of Stolen Crown',
        description: 'The throne is yours now. (Steal 10 points and the target\'s streak)',
        rarity: 'Legendary',
        price: 1500,
        css: 'rn-legendary',
        glyph: '🏴‍☠️',
        targeted: true
    },
    {
        id: 'rune_guardian',
        category: 'Defense',
        name: 'Guardian Rune',
        description: 'No force shall move the guardian. (24-hour protection against negative runes)',
        rarity: 'Legendary',
        price: 1800,
        css: 'rn-legendary',
        glyph: '🛡️'
    },
    {
        id: 'rune_reflect',
        category: 'Defense',
        name: 'Reflect Rune',
        description: 'What is sent returns. (Reflect the next incoming attack rune)',
        rarity: 'Legendary',
        price: 1500,
        css: 'rn-legendary',
        glyph: '🪞'
    },
    {
        id: 'rune_leader_seal',
        category: 'Attack',
        name: 'Rune of Leader Seal',
        description: 'The path upward is closed. (Target cannot gain leaderboard positions for one match)',
        rarity: 'Legendary',
        price: 1500,
        css: 'rn-legendary',
        glyph: '🚫',
        targeted: true
    },
    {
        id: 'rune_final_chance',
        category: 'Defense',
        name: 'Rune of Final Chance',
        description: 'One final stand. (If lives reach zero: Recover 1 life, Gain 15s. Lose streak)',
        rarity: 'Legendary',
        price: 1200,
        css: 'rn-legendary',
        glyph: '⏳'
    },

    // MYTHIC RUNES (3000 coins)
    {
        id: 'rune_reality_shift',
        category: 'Attack',
        name: 'Rune of Reality Shift',
        description: 'Reality bends. (Swap total score with the target)',
        rarity: 'Mythic',
        price: 3000,
        css: 'rn-mythic',
        glyph: '🌌',
        targeted: true
    },
    {
        id: 'rune_overdrive',
        category: 'Gameplay',
        name: 'Rune of Overdrive',
        description: 'No limits remain. (Triple points for 30 seconds)',
        rarity: 'Mythic',
        price: 2500,
        css: 'rn-mythic',
        glyph: '🔥'
    },
    {
        id: 'rune_emperor',
        category: 'Gameplay',
        name: 'Rune of Emperor',
        description: 'Rule above all. (+15 points and +2 lives instantly)',
        rarity: 'Mythic',
        price: 3000,
        css: 'rn-mythic',
        glyph: '👑'
    },
    {
        id: 'rune_fate_rewind',
        category: 'Gameplay',
        name: 'Rune of Fate Rewind',
        description: 'The timeline bends, but never for free. (Restore all lives and time. Lose streak, cannot gain streak)',
        rarity: 'Mythic',
        price: 3000,
        css: 'rn-mythic',
        glyph: '⏪'
    },

    // SECRET RUNE
    {
        id: 'rune_two_time',
        category: 'Gameplay',
        name: 'Rune of Two Time',
        description: 'The Spawn watched your fall... and decided to give you another chance. (Restore all lives and time, remove negative effects. Lose streak, cannot gain streak)',
        rarity: 'Secret',
        price: 9999, // Not sold in shop normally
        css: 'rn-secret',
        imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAAAkFBMVEUAAAD////+/v77+/sEBATy8vL39/fr6+sUFBT19fXg4ODo6Ojs7OwjIyMPDw/W1tbBwcHIyMgpKSnNzc2ysrJra2saGhq7u7uoqKhcXFyRkZEsLCwRERHi4uLY2Ng4ODhSUlJFRUWGhoaampqenp6kpKQ7Oztzc3NZWVljY2OBgYF7e3tJSUlpaWlycnIyMjKj8RYzAAAaH0lEQVR4nO1dCZeiyg6mKEAE2WQVFRHccfn//+7VBhSITtODPdx3OvfMne4epCskleVLKgjCL/3SL/3SL/3SL/3SL/3SL/3S/xFJgfmvl9AidTXk3YzTQRryfgPQ9TDk3bJMHfJ2Q9AxFYZ75sdoO+DdhqHYH+5eppMNd7OhKIqGu1c2O41OgEKsnYa61cayHmNjUBLO+n6omx2VMBgbg8iwh8pQuzAH0ehsKKLFZJ0Ocycb7INh7jQs7YG7Qcr6l7olCVIColEyeNKAfR/gPqY2UgkKBQSy//jrkM1cg3A+xHoGJkkwcxGIyT79qzBZElY6kK/js6KYHrYMAEiydBOo310gYnANxMU4GRRWsQJEAKey7u63370J2oMgMoZc1oAkxTriUBQBgOvo/J3tiKyohbQgHXplQ5GUzYAIMYcA6vvlN24gCC56RiOMthmttiHAIiRSdLPHN24RoY/qt8FXNhgtY42wR/6E39iKaCNDYF2HX9lgdHOR9DB7EAD33PvjhYwfTj5SQ0ro6iHWMCEu11lfv3ie4EfjjDHgriiIHYi5w6JQ4p7WdGPhj8njtTOETI/ID7MILz0/Ss2UNcZ4jaOlN4NMTddFPy2NiBGeLD60ssHorFEZAgj75cL3GXE0g0EEH6O7BqmWAq2XLV0mAO9gZ8RmlNFdpzJENnHT42OqSxjU+nzm35B5T6gtBXDfI3yWKIPygFDrx8gXmZLCuMenQrQH0edCc8zOHpMkLK1SSa0eIozwI0E6OnoG0XbKSzuj5O+uCxpROWNwPepghtGFMoiWq78Ln7c5z8xOJAxORu7qCV1guQuB/cbdn9a8BjMGZ+PM69VaFpJgxoxBLJA3qdNC4ZPjHVXR2TgleIs4XZyHLJrBK/akl0bDV3inx/bg5BuIwA9QcHEK9qUkbGegJOTYXnhuSTBCmZdWNGoJCqqns8hMEq4irBgUxeyVADNF58Fsj8Sio2VQ2FpaSr+aR6WG0pB006mjh2iCnXpFNMJDdnecRgZRBmy6tkslP5oZph0Xr84OAHpZPkUP4Kyz+E4bqR9EignlAv/9sDkBYh3tSCo2e7xNQ/JBIl6UZZUMrsYZyUhCCmkc6cs8g+jr57LR1caBXAVNmZtCB8yxAGu0oZoPQILU6+A0+MO7qlXIDy4zAjDRJpvgkcYaBKXfVPrE5z9KUow2FbKAMdZKkVfSFmI9D0WMLyaYbWl+CuWpWIkPhaIjhUYlYe4hBpfY2kPQYtDjDWMQY/6hm6IvzztnIvJXi73yj5+lFJkJbS5cMfLQ2oQu5yiWHuYfROhR+JoMQeNakRmeUdIZ2UXNEHwdgKlXRNNq4SiY4Vp8LgQ1jZAu32VqZRvPQhkvMFqgfaUFwn0CgLNCiljZUsTCjTEoMQHbiL/FDO1EyLtMYpDGCxvGWBdV4TgBCVlkiQHzDOJ2GMRSgjKMh9PUTkIQJKPdgtIOY34r4bYGOfHeGOcs5XIsGURsQTDFYXkswmRfxBYEfFgHxwuLGh42gapwsOCR/OBglUuHoILxbzr6DjuThQZIkS3VOAYhsAZtQB2USA7ooOA5hDRACUhSiF0ABJXzziD6bh3gBiKb8uJxigqB928W/xWqGNwxeQV2LcESejIjHMIQb6mx7te9yJlbMNowhqgoBJMHUrqE7qMTSQ+gjCu3O3bRxiE1MiRir+TZqx2F+K/aENRgaQTG3DCCN1Hwao8YUbDwzhHp6Mmxbk7iW6aJFYOLNUlqI2SCWES2STgB9sKJByL1FrnJmpFmObtXDQZmjldKrPwCo+8bC/FHVkztKqHLlKISqSCxVJfbgmK/WsYAZJxjz9Wbvgomjhf7XbbuRppl7AKxuBJM3xWrIDRkW0uiwBki7UL523gKH/Acv7PI6zHzt72TZKyLV08ncQYKN0qi2wXqFhVkQ2M3NE2Sw5sRLPZ6uWLkESOWTuCv2IaT861qGme3YULDnnga/vWnUHO90/wPtdauds9TZBHmxKYEUR6Af6A4ud9+agVbrG7bGk0o1jTuKlg5u5Ygijmt0LM1jj/0o95dMubR1rUs/YJizw+UT4n8QfS4aKAKhMV2gke+k6PFnBOiJDysslGGmnwIXAr6puuCXCch71f/M5EarB6gCPd9e7YPOxnY6ZcuDY5ZI2XzHWTSoCjyrDV5xFGyHDZTdZ/1WLBVI50LGIN3xqBX7zii8twz6x/EpBaYxcEX2423XnzezlXTXAXLQ7onrWcNdppRP1sT0AoexAy8xlUoLqGtJFf39sQglaJsudqUfqcXnQt7TXO0hXZf73NYxZruevt857lyjdpCRU8sJ4x26OeOxsfFjEXR4vuZg0jkLoEljLjdla2uOBjgnoB7NKTDnrQ4KX35S10Ao14Y8Xyvc6k4bv+0wl2W1ojYY6+0OCRhyY5T7sDlEli0B6nWbaqb2DWDyBvmxBRfscPsncjPkY2we54kMa9FHCJ3rq9d28t8P523jvOZcYeiAsVL60uuGm8X2bmYepPUDCL+WIpBg9heLl5CuoJu9J1q/sqYL5fz4EVzshG1RUjUlI8gC/2N535YoGpnm5W6fUDO0O3bnpjhjr/vdG3+geocr2ErtKJ6HubV5faZ18zPbzX306pbD8WsIXdZ15NV2y73hoGf9BsMSMQNSlK35UVeMhbFZw6RRz/WK8uqjSwC/d5YcF7ju5XTm7vASuvf0F4O/tHKbzwnCQdNEFehPoCAb9dPu5B4Eb1WxiAvbRHivGE7rnXmoJQ8GSH0eP1cnrM8zvP4cq8sU7q7N23BHG9ADKB+gEGpFkJTkut6xxtRjVPPjlIliKVdwVAYViOrM3b6jtO/pR/qpQ4n0f10fRiHo9XGgjNaOf5MFepK0UBR5EIb2XanZdyJacNVsNeVaNM6cxAh83pG7nEwYXC3p8T5krgey3lte9pTiLO1MPKvxJ85sT2ftSSIpBSr29hVnHodZ87OaLdANZBlPlucyGdMK7cxZwmDWKdN0Q1S3JY3MCgGsP4IgCoJKskxwNSNIndGvoTkmOs80z2zvOihcb5iGka2ZWmNIIG1vUq8ELYhpE9NmWiatp7IsqLM1k7Rqr2ZO3IZ3A96wp27P+1bxbCLeXYwRiYzh72wK3BQ3dXGtqwccQUWsYzheCrW9BJoxVtDVY3D+Z5li/mTHckwKADfdqd8h61gXh4wI6Vmph8b7PNgiUecqmPwdZ8MY6iVbXUweNZpCwKMaqXtclamRTMxbUgBSgsvmchrKyaK5YkksiK//IIVzyqXNC+XbeZNBtsRLFbR5uJ92u4LygxLmD+MLiewDGk71LBFKOlxOt8uFtrvOGtM0bOWaQYrbHBwCauz5nRL4QaY54CnQTJf5ZSEpUdPlUAafi1yz3Zd1/GKNoaxohiVSKobQ9PWAaS+bOKcJ2RRR9zR+IEiDe09gyLMqqhFKu8CSmT7WLpCIHv4QUj1lTGkaDkY8Px+Tbj4Ps2xmgAwYbb7SE7WNX2uJGyV9wIEIl8lW+5L1wPRwoOLNnOcCSAeAyY5L6pCEWknxocA4tsUdxyrwnWfgORMxFZQdAm7M27LFE0BkpJ1q6rtFgey20zjVAU4hMFlnp0P23tsK/THbnE1qOo/srKVRv8OvvgFMqPSK1xtKIZnVZAiFtew1FaiPT28hvIFeL4WD5LdZTHfZt6s9iCQUz2Cf5BP6BFKu4NDwZJpcsLpQ3SaYAuI98UjC8N4ibNxBgN6aeWyDm0TI051TdOnzZ9hm6KH7pSvgrLqEn1MaR0UKlq0c5SKP+cDFoaRj73spMbS6gRYVKxsQ1i82s2y+3TtZYvtJo3DtdJS3JLTmkFuNkYqc8+C/GGyb7fdDEkBiQOTO3VWywuXviOLoNseMvB6g4e151fI0LIIdbG1OxtixfqRsosfdtOVVqFv0v/oXg86kDNiMwzDBEd7yi+VQqIip3JEmxqhZHDugAQaDIoOta/LqOtJoL/0j/JHdwZahu44lgzaxrIpFbSY7AnXuzovOWQqq0fF2d8nz/gWueX0410YN41j4QlFbBhKr8sYbO0uDkUC4jNIXNZnIui4ChevPiw/TP4E8KWmVyQCrbvr7FmGDRSdYegd0A/ur/mc/eTo5NTiEjtAKMaffXrRjb6YPl+OfN2lKLLMU2gBq0t8jUzjo3TIw3KLMB6fVyS+RvVIyspfKrv5mT2KoPBm4JnwY1Tcyw82CV1jL5Fhcw3Nb+zXxTAjaUhGj3HSIJVg5WX6pMJkY+5+uFndvB7zfWQ7tu04bqK3e87enpLLaxGi5PnCAxeIR61tnHG45hQfgii+RsF2t+b0Dn3hvGtMftQAKZDbdl9qukrslGQn/ejyv0SbeMKJ5Q+NyV5VZoO52noSN5kLj0jE6qXjmBV0q8wDilff+6uiYiJplZWuuwkFqkQCjYqKmx3GMbJSEtRdZVpB8t4i+DOW2eFGGipAdZHFe8/RpnXgCWdOvlj+ixZ8Du7ika+DVm1B9/1TT3VAm5nFapiauTkdo0m1M92ouJ2ujx8X3qvCk0CqkjZL2QCw3u+a7brEvhPedxvXs38/FkffXxz+5fmX1eOQ3lHYkWWX+yLdMPuNdLQs0YvNdT/TSS8ZfAfgvn6YnyNjc13cd7ZbJX2JF582JWYfVwc/9fTtbe6lkRFhY6iHVNPHWHhHc99LWFZOO0vWYXY+pZUVP8ulBOX3w+QqKyp+r1D7ETIefjgBtM2H2jk9XDQbLNNZySB8jwvV0SgE+3GcNjMzbQqbJRT4BN7FdTTz1sqYFh/1jOGkhHGx5VaNQWzi75h8ztO/7axLdZ7BSf7Px1ekpPLaYlCUDzXai/9O1zwEZb8pocfNjiKYRJd/eSRru1+DZwQBqWjEP/lN3MgCxOmrJSN/aYE2TTUHJyaht89j//qzh0OKROxCEBApVsZAs+V5ZzWlIgLvVbRmXlotYc2bQz1xovuP8bjJJ88FPgYS4XKst8uKbEfA0NZFL/o/JeGhd6lDE+aRPf9nMoitLXbhPyUPYvWd+NQ98DJlit+gVQT/IC5Wjn5gYIB0tbrgO/yEE8cqnWLb/FRPQY5bJXb8nRF3YE4tHkm/LexEHYcl7uhwk6zsIC19h5ZbXwkEV5DuFWNMXR9cT2wXKlfZYcSi/mn3cV2/MC42hRnSSO6Wb8UAWBdLbi+p89RrltPaDKJvJi4yqDrWC7j7rKk5zTi/xhVCuPb//TMA1ooG4My+MBbNu7ee8i3BpKepfQOLIIipQ+710ZGqqdPscKnybFCHaFe34ftEsap1cSKZJm5+ySObFDO4CGbmFWf/gvuJ+K4p5lzUTP5zzP4XJAkHpxxxh6EDR5+WKycMSiyXz0Q+6AJQ81C+wRte+hWUmcHlG55px4j6KJJy69XNDTj4xfYr+dgbGqS4Sgy8xWE+P2yLcEZBvNJ0COZcWFRQGq6q7RebIHhc7zYvxBfnEoBbhjrSMlNKiOYiqGfP3uNDJ2qO+6h69NX3o9uE/U6xmo02TyOFLlP3inSbZvGGnaGj/LmL0p5g79nYWB3GRGN4KBGQ77BHlwrmBn0zC89YS9Gvkz9UTjJshgrJuHW/TLGDi6tQn65Yrq5kknCsUlxoX4VKdTc7GbwlEslxkToJ1MvedCNCKQbaBybuFPPUvx4030U0XERPdVdbefxrDherBOmTiySY+5K/abPys8qeKgwtBnfNPBdP+ID4oAD+NXM8igXtgxOKMz4zcXTDrCO0n+Kla+bZKOyPYiwwdsQYz09rhY6S+55Bsb3uCO842uAjCf6EDuJMbQUZ1s2fDpf1p5y1vLl/8EMRk/Msf8Id9o0aWcuni6SZq0HkmSK2iTqq+Mb2CmnrHun6zI1Pw8KIKiszax1uyFyVj1NdFmTnIKNzeQ7983cMon/K6W3MU6kjF5k7hY1tODnNFNz3nmvZuT9o8ew+IQKUn2EH4xzv4yJ9zOfzq6crVD87x2O3GEQZgsJ1sMHq/SBxzpZukjOxe2pQyHlZl10irVbmsHbGI3oH2y19y9zVZgpU5Mla09bk7CsyDFN+opowL3Up5AJnkKCs8Z7ybelgxuy/uncWUsUg2vX37WOTk+jmY0MApYQIsN2WG0QtS0GS3mkjIlZjVqhUuRIg1H12iKA+FYP8BFPrxZq6xIdG/1HWXAK+UtDnIzTXca9DOUSspJMrh5fM0xq1XNlbcNvPvNjlIZWUm2RRF8AeUaW4YnWmvJD1KLtfbNoLym3TJ0M0FKHFwafBLmaoHQNcH7llKG5ez+SprFn7M29djKjuvN/Xp3gc7pqlU8oQ+QSm2iaeAi+XfWyVNUJ/OnrXB6FiSiOIBn9ZjV6uNteFfzz66Zae62SEclm7Cta0Sg4YPq1NRMGJsCxM07i3I/WcfQZMxEOlsJttGC41o/y9Dps2YT3txihVEf0vbLTLzL1addnzkISH0z5cSmUJ4o+MICuQb51cWsFDkzGp8Reh1AZyOQ9gtattybRoftDn7AwsE9p51Mkh0P5oZnrzLwkBTqZ7znEn5x7wyDdKPteQN2t0UUjCuc7hEYdlRIpPdHaBk58QIZ6dGfbtmZJCoACLrsW88QM41mWkItEN26pLHMsWJ68D33nRPGmqqvFYLjePx8PoH6U+3OfWhz+S4ZF2XfKxbajwSyxnMQYLqo4bp+EKlLg0ZveOo4ni8xms1ePmJWtdns1k9N/EPfZiURKMHahz7S8TGc8LoBsvip3VwJWY3krClhx3lfCR3UZiX8eDh2jWcUhmvTsdtlhch8X9mIc2CqYqTwzlKZy6cdpHi1HIq/U+3VydzVV0uW3wHcbg1aUMbpuNTPy8eDWWn7wFbr5NLMdxXU2fld1xBEZXnCjz/cyzFO3rCPEcT4fY9t3W1Wm6EljiOqyBze62YGcG2XDOqkWRT33Vazxps9iBS+L8bLdIyQY0g8fJj9tn8F7RNQTyy4k4L0mK62Ov1SS4smyBZxhTBsmxdyTBBNSoGxTb2OAZGRvQQEvLtlRWOUdfAOg0R6Fcs6/I0FzsZ8A79U8sU63xjCdhFNnVcflqUFpKZllJwoL6A8XyPItMXuCUFBva4O7QNEVsMsn9vY43QtVkQv4yHn/SOsnYLiLb+07LqRHyWqTbx7lqPrIydK66Ec44mUWLuZGfJ/FVla4ZQSJxLMCv7xB7tN9WfCIsdM3ushF/3FbL83n7PeTj3ui4LiMEEw+hxIsvY3Yf6ESP8Ow/ESNwAd43dJTq0zi8NLbXDWdTkqzlpx9toZGw36y9OmAvKpUCPNahscF8EXoPQbpgf06OVKZ3vBv28MW4uG0cIo8wrZMzlGcnYfHz/Qo3vtxQdrc+LioZb8RFandkHexsr7NMDD2GY74iFSzlxXFOFc+jipCDsBLXce34uPj79zj2p2XIC7BEUYpwhbFcyL3h5I4FqhCzotMQ2sdDnYUQz515szkkyVQD1RwYlPk6FfygVLxSnBwd9JAMPsB4fnnhra5O4dmGOOwGjoDBqWZKPDbacSNwRBZumzs8SC0g6H+1vU6lHawYXJBsCKXzbxlkedq/6c57CryUXMJHC6H2ILNzIJCrbDCFlQRJaRpLEP9rrtTRzggpbsVSMLqEbOIfmW1Yv+krrV9BwYxMgdJB3Jcnjnjo5rarAkFfYIbdBDIf7EKJZ5DCTXjmxg6j/9hNjFWEx3aWSnrlJwUFdsR6CAtSZr6gZp83B5xC7uigrmi0DMagI2JMbniaNlbQam4TPlu/5p+FbK0hPV0RgjGPTfV4G0rWr0zcE9LPkLQH1QuXyikplUchDvFEGJSL0Uow5BjEhYUZyukDDEuQjKhR4zSzZo2eFHQlPInsCUMfD82rWgP2b7Kbp4SllJx4h16zeJq2ar4s07DJALiR0onVSzA6uD8dWCH2RhrAtEUr/grchktB/IXYH+7giLdgVrYgiHJGgxEUcNDhAUnrsLvEd6JTBtcEEixk+LFun78mNvwEeWoiLmop9gAPoOjAEM4NnwJZDoH85Ri60rupPFDNw1oHC8y8TsTd4MM68hZU8kQy4Ix1PLrqUlgCn/asel4uinY0uiGEvHGGsmx5NqLRbkLDou/O0LifzcPX76e98oMd6523scN/fq6gmwiDaMkWVyB7aG+qlnXdXsQDKcsPqfHLBvZ/S3PGoMsxuNXfmIxzJULYGFyppj8yAKA3VQxyW+6Q3N/EXVwBO2+4yXGGagFj0OZ+pkbnN6st52x/sk9yQJIcggwSaKUi/522VaXttgTHSZJNywwWr2LGW+y/fEEIygH7jg3/F0RGpYog6VFn3tNdiAK19IMLG4pIsN3vxbIbu+TQHqnz42lO3+6sfx1wloSzWCrpeKGmmkLCYK/Xkj48mhfiQyPjdO88RYTBfmPc1bw6bR/+7EHB3iQRWBRXcXtZxKVVcij+zAijbxPaUBQqc/rpWnkmCrvQ9DNLG4ok2nXfdx7toj71NYlHXHgRyKsGRFFU+mrawRaZpQFTPCluvC7fRI4bMdi7cwjj9mReDA6EfmBW2vcJZUBQhP2XeNjNyo0I195I3/uJiQxkfp3Evya1IAM16Va0nl4BNBYiTQhA7D+WHc++3+Gz22TiH1A+NRd8ADoiX+99680Bqh+uS9gf5iOF1iQckALnu+D7KVzTN7miiHa0G/EmA+v7mYFxzm2N1A61sb7fdJP076DlyQwevo3laI1UhoFXd8N8+x4b/C6G3u+2+QnC88vFv2YQ3WfjwbGC+HfSNvJXRHoiIwXko4zaztBa/v3CJMHIgTvKHPiMh90P8eSD/Ww3wG0Gp1v/cySdJAlmqI+xnJ2Jg+UDt7eDV/8RqZE+kHlHka39kTdJ/B1t3HiwSFkqRvi272LIV6xv4tH5iYPT9+WP72juj41Bo7gPWScyf2BUVT/ajDUHGIrM/0Cd75d+6Zd+6Zd+6Zd+6Zd+6Zd+6av0P1bohx44a91nAAAAAElFTkSuQmCC'
    }
];

// Extendemos el sistema de rarezas (RARITY) de los banners
const RUNE_RARITY = {
    Common: { color: '#aaa', glow: '#aaa' },
    Uncommon: { color: '#00ff4c', glow: '#00ff4c' },
    Rare: { color: '#00ccff', glow: '#00ccff' },
    Epic: { color: '#aa00ff', glow: '#aa00ff' },
    Legendary: { color: '#ff6600', glow: '#ff6600' },
    Mythic: { color: '#ff2222', glow: '#ff0000' },
    Secret: { color: '#00ff00', glow: '#00ff00', rainbow: true },
    Divine: { color: '#ffd700', glow: '#ffd700', divine: true }
};

function getRune(id) {
    return RUNES.find(r => r.id === id);
}

function getRuneRarity(r) {
    return RUNE_RARITY[r] || RUNE_RARITY.Common;
}

if (typeof module !== 'undefined') {
    module.exports = { RUNES, RUNE_RARITY, getRune, getRuneRarity };
}

