# Space Trash Scavenger Support for [Vortex]

## Description

This extension adds support for Space Trash Scavenger to [Vortex Mod Manager], enabling you to easily automate installation of mods for Space Trash Scavenger without having to worry about where the files are supposed to go, etc.

At this time, the following mod types are supported:

- BepInEx Pack for Space Trash Scavenger
- BepInEx plugins
- BepInEx patchers

If you are developing a different kind of mod and would like it to be supported by this extension, please [raise an issue or pull request on the GitHub repository](https://github.com/MrPurple6411/Space-Trash-Scavenger-Support/issues) with a link to your mod page so that I can take a look at how you are packaging it. Please make sure to include instructions for how you would expect it to be installed, so that I can have Vortex automate the process. PRs welcome!

## How to install

This extension requires [Vortex] ^1.8.0. To install, click the Vortex button at the top of [the Nexus Mods page](https://www.nexusmods.com/site/mods/699) to open this extension within Vortex, and then click `Install`. Alternatively, within Vortex, go to the `Extensions` tab, click "`Find More`" at the bottom of the tab, search for "Space Trash Scavenger Support" and then click `Install`.

You can also manually install it by downloading the main file and dragging it into the "drop zone" labelled "`Drop File(s)`" in the `Extensions` tab at the bottom right.

Afterwards, restart Vortex and you can begin installing supported Space Trash Scavenger mods with Vortex.

***

**<center><big>The rest of this page is intended for mod authors only.<br/>Users can simply follow the instructions above to install, and you're done!</big></center>**

***

## How to make my mod compatible with this extension?

Assuming your mod is of a supported type, simply follow the packaging examples for that mod type below.

Don't forget to set your latest main file as your main Vortex file, and make sure that the "`Remove the 'Download with Manager' button`" option is unticked!

If your mod is not of a supported type, you will need to [raise an issue or pull request on the GitHub repository](https://github.com/MrPurple6411/Space-Trash-Scavenger-Support/issues) with a link to your mod page so that I can take a look at how you are packaging it. Please make sure to include instructions for how you would expect it to be installed.

### Packaging examples

#### BepInEx plugins

Any of the following structures are valid:

```
- MyBepInExPlugin.dll
```

```
- My BepInEx Plugin
  - MyBepInExPlugin.dll
```

```
- plugins
  - MyBepInExPlugin.dll
```

```
- plugins
  - My BepInEx Plugin
    - MyBepInExPlugin.dll
```

```
- BepInEx
  - plugins
      - MyBepInExPlugin.dll
```

```
- BepInEx
  - plugins
    - My BepInEx Plugin
      - MyBepInExPlugin.dll
```

#### BepInEx patchers

Any of the following structures are valid:

```
- patchers
  - MyBepInExPatcher.dll
```

```
- patchers
  - My BepInEx Patcher
    - MyBepInExPlugin.dll
```

```
- BepInEx
  - patchers
      - MyBepInExPatcher.dll
```

```
- BepInEx
  - patchers
    - My BepInEx Patcher
      - MyBepInExPatcher.dll
```

#### BepInEx plugin/patcher combos

Any of the following structures are valid:

```
- patchers
  - MyBepInExPatcher.dll
- plugins
  - MyBepInExPlugin.dll
```

```
- patchers
  - My Mod Name
    - MyBepInExPatcher.dll
- plugins
  - My Mod Name
    - MyBepInExPlugin.dll
```

```
- BepInEx
  - patchers
    - MyBepInExPatcher.dll
  - plugins
    - MyBepInExPlugin.dll
```

```
- BepInEx
  - patchers
    - My Mod Name
      - MyBepInExPatcher.dll
  - plugins
    - My Mod Name
      - MyBepInExPlugin.dll
```


#### My mod is being installed strangely!

If you have followed the packaging examples above and your mod is still being incorrectly installed by this extension, please [raise an issue on the GitHub repository](https://github.com/MrPurple6411/Space-Trash-Scavenger-Support/issues) with a link to your mod page or with a sample archive attached so that I can get it fixed.

## Copyright notice

Converted to Space Trash Scavenger Support on November 12, 2023 by Joshua Gibbs aka MrPurple6411

Space Trash Scavenger Support - Vortex support for Space Trash Scavenger

Copyright (C) 2023 Tobey Blaber

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, see <https://www.gnu.org/licenses>.

[Vortex]: https://www.nexusmods.com/about/vortex/
[Vortex Mod Manager]: https://www.nexusmods.com/about/vortex/
