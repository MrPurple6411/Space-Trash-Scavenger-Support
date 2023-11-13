/**
 * Space Trash Scavenger Support - Vortex support for Space Trash Scavenger
 * Copyright (C) 2023 Tobey Blaber
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 3 of the License, or (at your
 * option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
 * for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, see <https://www.gnu.org/licenses>.
 */

/**
 * Internal extension id used for namespacing of session/localStorage keys.
 */
export const EXTENSION_ID = 'me.mrpurple6411.vortex.space-trash-scavenger-support';

/**
 * Name of the game.
 */
export const GAME_NAME = 'Space Trash Scavenger';

/**
 * Path to the Space Trash Scavenger game executable relative to the game directory.
 */
export const GAME_EXE = 'SpaceTrashScavenger.exe';

/**
 * Path to the Unity Player assembly relative to the game directory.
 */
export const UNITY_PLAYER = 'UnityPlayer.dll';

/**
 * Options for Vortex translation API.
 */
export const TRANSLATION_OPTIONS = {
    /**
     * Replacement strings for Vortex translation API.
     */
    replace: {
        game: GAME_NAME,
        bepinex: 'BepInEx',
        plugins: 'plugins',
        patchers: 'patchers',
        legacy: 'legacy',
        stable: 'stable',
        steam: 'Steam',
        experimental: 'experimental',
        vortex: 'Vortex',
        'br': '<br/>',
    },
} as const;
