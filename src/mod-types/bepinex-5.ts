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
import { join, sep } from 'path';
import { BEPINEX_CORE_DIR, BEPINEX_DIR } from '../bepinex';
import { getDiscovery } from '../utils';
import { BEPINEX_INJECTOR_CORE_FILES } from '../installers/bepinex';
import { NEXUS_GAME_ID } from '../platforms/nexus';
import { types } from 'vortex-api';
import IExtensionContext = types.IExtensionContext;
import IGame = types.IGame;
import IInstruction = types.IInstruction;
import IState = types.IState;

/**
 * BepInEx 5 mod type.
 */
export const BEPINEX_5_MOD_TYPE = 'bepinex-5';

/**
 * BepInEx 5 core filename.
 */
export const BEPINEX_5_CORE_DLL = 'BepInEx.dll';

/**
 * Determines whether the mod type is supported for the specified game.
 * @param gameId 
 * @returns 
 */
export const isSupported = (gameId: string): boolean => gameId === NEXUS_GAME_ID;

/**
 * Retrieves the absolute path to the installation directory for this mod type.
 * @param state 
 * @param game 
 * @returns 
 */
export const getPath = (state: IState, game: IGame): string => getDiscovery(state, game.id)?.path ?? '';

/**
 * Determines whether a given mod is of this mod type.
 * @returns 
 */
export const test = async (installInstructions: IInstruction[]): Promise<boolean> => {
    const copyDestinationsLowerCase = installInstructions
        .filter(instruction => instruction.type === 'copy' && instruction.destination)
        .map(instruction => instruction.destination!.toLowerCase());
    return copyDestinationsLowerCase.some(dest => dest.split(sep)[0] === BEPINEX_DIR.toLowerCase())
        && [...BEPINEX_INJECTOR_CORE_FILES, BEPINEX_5_CORE_DLL].every(file => copyDestinationsLowerCase.includes(join(BEPINEX_DIR, BEPINEX_CORE_DIR, file).toLowerCase()));
}

/**
 * Registers the BepInEx 5 mod type with the Vortex API.
 * @param context 
 * @returns 
 */
export const register = (context: IExtensionContext) =>
    context.registerModType(
        BEPINEX_5_MOD_TYPE,
        50,
        isSupported,
        (game: IGame) => getPath(context.api.getState(), game),
        test,
        {
            name: 'BepInEx 5',
            mergeMods: true
        }
    );
export default register;
