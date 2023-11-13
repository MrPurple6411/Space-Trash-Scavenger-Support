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
import { basename, dirname, join, sep } from 'path';
import { store } from '../';
import { BEPINEX_CONFIG_DIR, BEPINEX_CORE_DIR, BEPINEX_DIR } from '../bepinex';
import { BEPINEX_5_CORE_DLL } from '../mod-types/bepinex-5';
import { BEPINEX_6_CORE_DLL } from '../mod-types/bepinex-6';
import { NEXUS_GAME_ID } from '../platforms/nexus';
import { types } from 'vortex-api';
import IExtensionApi = types.IExtensionApi;
import IExtensionContext = types.IExtensionContext;
import IInstallResult = types.IInstallResult;
import IInstruction = types.IInstruction;
import TestSupported = types.TestSupported;

/**
 * BepInEx core filenames.
 */
export const BEPINEX_INJECTOR_CORE_FILES = ['0Harmony.dll', 'Mono.Cecil.dll', 'MonoMod.RuntimeDetour.dll', 'MonoMod.Utils.dll'] as const;

/**
 * Determines whether the installer is supported for the given mod files and game.
 * @param files 
 * @param gameId 
 * @returns 
 */
export const testSupported: TestSupported = async (files, gameId) => {
    const filesLowerCase = files.filter(file => !file.endsWith(sep)).map(file => file.toLowerCase());
    return {
        requiredFiles: [],
        supported: gameId === NEXUS_GAME_ID
            && filesLowerCase.some(file => file.split(sep)[0] === BEPINEX_DIR.toLowerCase())
            && (filesLowerCase.includes(join(BEPINEX_DIR, BEPINEX_CORE_DIR, BEPINEX_5_CORE_DLL).toLowerCase())
                || filesLowerCase.includes(join(BEPINEX_DIR, BEPINEX_CORE_DIR, BEPINEX_6_CORE_DLL).toLowerCase()))
            && BEPINEX_INJECTOR_CORE_FILES.every(file => filesLowerCase.includes(join(BEPINEX_DIR, BEPINEX_CORE_DIR, file).toLowerCase()))
    };
}

/**
 * Parses the given mod files into installation instructions.
 * @param api 
 * @param files 
 * @returns 
 */
export const install = async (api: IExtensionApi, files: string[]) => {
    api.dismissNotification?.('bepinex-missing');
    api.dismissNotification?.('reinstall-bepinex');

    return <IInstallResult>{
        instructions: [
            ...files
                .filter(file => !file.endsWith(sep))
                .map((source) => {
                    let destination = source;

                    return <IInstruction>{
                        type: 'copy',
                        source,
                        destination
                    }
                })
        ]
    }
}

/**
 * Registers the BepInEx installer with the Vortex API.
 * @param context 
 * @returns 
 */
export const register = (context: IExtensionContext) => context.registerInstaller('bepinex', 50, testSupported, (files) => install(context.api, files));
export default register;
