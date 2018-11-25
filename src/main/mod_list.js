"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("./config");
class ModList {
    /**
     * Reads the mod directory and returns the contents
     * @returns string[] A list of mod filenames
     */
    static getModList() {
        const modFolder = path_1.join(config_1.default.readConfigValue("installFolder"), "mods");
        return fs_1.readdirSync(modFolder);
    }
}
exports.default = ModList;
//# sourceMappingURL=mod_list.js.map