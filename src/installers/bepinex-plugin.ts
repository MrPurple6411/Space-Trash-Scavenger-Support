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
import { basename, dirname, extname, join, sep } from 'path';
import { BEPINEX_INJECTOR_CORE_FILES } from './bepinex';
import { BEPINEX_CORE_DIR, BEPINEX_DIR, BEPINEX_PLUGINS_DIR, isBepInExEnabled } from '../bepinex';
import { NEXUS_GAME_ID } from '../platforms/nexus';
import { types, util } from 'vortex-api';
import IExtensionApi = types.IExtensionApi;
import IExtensionContext = types.IExtensionContext;
import IInstallResult = types.IInstallResult;
import IInstruction = types.IInstruction;
import TestSupported = types.TestSupported;

/**
 * Determines whether the installer is supported for the given mod files and game.
 * @param files 
 * @param gameId 
 * @returns 
 */
export const testSupported: TestSupported = async (files, gameId) => {
    const filesLowerCase = files.filter(file => !file.endsWith(sep)).map(file => file.toLowerCase());
    const assemblies = filesLowerCase.filter(file => extname(file) === '.dll');
    const assemblyDirs = assemblies.map(file => dirname(file).split(sep));
    const index = assemblyDirs[0]?.indexOf(BEPINEX_PLUGINS_DIR.toLowerCase());
    return {
        requiredFiles: [],
        supported: gameId === NEXUS_GAME_ID
            && assemblies.length > 0
            && assemblyDirs.every(segments => segments.indexOf(BEPINEX_PLUGINS_DIR.toLowerCase()) === index)
            && !BEPINEX_INJECTOR_CORE_FILES.every(file => filesLowerCase.includes(join(BEPINEX_DIR, BEPINEX_CORE_DIR, file).toLowerCase()))
    };
}

/**
 * Parses the given mod files into installation instructions.
 * @param files 
 * @returns 
 */
export const install = async (api: IExtensionApi, files: string[], workingPath: string) => {
    const sansDirectories = files.filter(file => !file.endsWith(sep));
    const assembly = sansDirectories.find(file => extname(file).toLowerCase() === '.dll')!;
    const assemblyDir = basename(dirname(assembly));
    const assemblyDirIndex = assembly.split(sep).indexOf(assemblyDir);
    const filtered = sansDirectories.filter(file => file.split(sep).indexOf(assemblyDir) === assemblyDirIndex);
    const index = assembly.split(sep).indexOf(BEPINEX_PLUGINS_DIR);

    const instructions = filtered.map((source): IInstruction => ({
        type: 'copy',
        source,
        destination: join(dirname(source).split(sep).slice(index + 1).join(sep), basename(source)),
    }));

    return <IInstallResult>{
        instructions: instructions
    };
}

/**
 * Registers the BepInEx plugin installer with the Vortex API.
 * @param context 
 * @returns 
 */
export const register = (context: IExtensionContext) => context.registerInstaller('bepinex-plugin', 35, testSupported, (files, workingPath) => install(context.api, files, workingPath));
export default register;

