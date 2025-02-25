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
import { join } from 'path';
import { BEPINEX_MOD_PATH } from './bepinex';
import { NEXUS_GAME_ID } from './platforms/nexus';
import { remark } from 'remark';
import rehypeFormat from 'rehype-format';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import strip from 'strip-markdown';
import { actions, fs, selectors, types, util } from 'vortex-api';
import setModsEnabled = actions.setModsEnabled;
import statAsync = fs.statAsync;
import activeProfile = selectors.activeProfile;
import currentGame = selectors.currentGame;
import discoveryByGame = selectors.discoveryByGame;
import IDiscoveryResult = types.IDiscoveryResult;
import IExtensionApi = types.IExtensionApi;
import IMod = types.IMod;
import IState = types.IState;
import toPromise = util.toPromise;

/**
 * Utility function to retrieve a game discovery result from the Vortex API.
 * @param state 
 * @param gameId The game ID to retrieve the discovery result for. Defaults to Space Trash Scavenger.
 * @returns The game discovery result, or undefined if the game has not been discovered.
 */
export const getDiscovery = (state: IState, gameId: string = NEXUS_GAME_ID): IDiscoveryResult | undefined =>
    discoveryByGame(state, gameId);

/**
 * Utility function to retrieve the path to the mods directory.
 * @param gamePath The path to the Space Trash Scavenger game directory.
 * @returns The path to the mods directory. At this time, it always returns the path to the BepInEx plugins directory.
 */
export const getModPath = (gamePath: string = '') => join(gamePath, BEPINEX_MOD_PATH);

/**
 * Utility function to retrieve a list of mods for the specified game from the Vortex API.
 * @param state 
 * @param status Which mod types to retrieve.
 * @param gameId The game ID to retrieve the mods for. Defaults to Space Trash Scavenger.
 * @returns A list of mods for the specified game.
 */
export const getMods = <T extends 'enabled' | 'disabled' | 'uninstalled' | 'all'>(state: IState, status: T = ('all' as T), gameId: string = NEXUS_GAME_ID):
    T extends 'enabled' | 'disabled' ? IMod[] :
    T extends 'uninstalled' ? (Pick<IMod, 'id'> & { state: 'uninstalled' })[] :
    T extends 'all' ? (IMod | (Pick<IMod, 'id'> & { state: 'uninstalled' }))[] :
    never => {
    const mods = Object.values(state.persistent.mods[gameId] ?? {});

    switch (status) {
        case 'enabled':
            const enabledModIds = Object.entries(activeProfile(state)?.modState ?? {}).filter(([_, entry]) => entry.enabled).map((([id]) => id));
            return mods.filter(mod => enabledModIds.includes(mod.id)) as ReturnType<typeof getMods<T>>;
        case 'disabled':
            const disabledModIds = Object.entries(activeProfile(state)?.modState ?? {}).filter(([_, entry]) => !entry.enabled).map((([id]) => id));
            return mods.filter(mod => disabledModIds.includes(mod.id)) as ReturnType<typeof getMods<T>>;
        case 'uninstalled':
            return Object.keys(activeProfile(state)?.modState ?? {}).filter(id => !mods.map(mod => mod.id).includes(id)).map(id => ({ id, state: 'uninstalled' })) as ReturnType<typeof getMods<T>>;
        case 'all':
        default:
            return [
                ...mods,
                ...getMods(state, 'uninstalled', gameId) as (Pick<IMod, 'id'> & { state: 'uninstalled' })[]
            ] as ReturnType<typeof getMods<T>>;
    }
}

/**
 * Utility function to reinstall a mod via the Vortex API.
 * @param api 
 * @param mod The mod to reinstall.
 * @param gameId The game ID to reinstall the mod for. Defaults to Space Trash Scavenger.
 * @returns True if the mod was reinstalled, false otherwise.
 */
export const reinstallMod = (api: IExtensionApi, mod: IMod, gameId: string = NEXUS_GAME_ID): Promise<boolean> => {
    if (currentGame(api.getState())?.id !== gameId ||
        !mod.attributes?.fileName) {
        return Promise.resolve(false);
    }

    return toPromise(callback => api.events.emit('start-install-download', mod.archiveId, {
        choices: mod.attributes?.installerChoices,
        allowAutoEnable: false
    }, callback));
}

/**
 * Utility function to enable/disable mods via the Vortex API.
 * @param api 
 * @param enabled Whether the mod(s) should be enabled or disabled.
 * @param modIds The ID(s) of the mods to enable/disable.
 * @returns 
 */
export const enableMods = (api: IExtensionApi, enabled: boolean, ...modIds: string[]) => setModsEnabled(api, activeProfile(api.getState()).id, modIds, enabled);

/**
 * Utility function to determine if a path is a file on disk.
 * @param path 
 * @returns 
 */
export const isFile = async (path: string) => {
    try {
        return (await statAsync(path)).isFile();
    } catch {
        return false;
    }
}

/**
 * Strips markdown formatting from the given string.
 * @param markdown 
 * @returns 
 */
export const stripMarkdown = async (markdown: string) => String(
    await remark()
        .use(strip)
        .process(markdown))
    .trim();

/**
 * Converts a given markdown string to HTML.
 * @param markdown 
 * @param references An optional array of references to be used to convert markdown links with references to HTML links.
 * @returns 
 */
export const markdownToHtml = async (markdown: string, references?: string[]) => String(
    await remark()
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(`${markdown}\n\n${references?.join('\n') || ''}`))
    .trim();
