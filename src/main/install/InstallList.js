"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const Install_1 = require("../types/Install");
const Config_1 = require("../utils/Config");
class InstallList {
    /**
     * Reads the install directory and returns information on each install
     * @returns Install[] a list of installs
     */
    static getInstallList() {
        // find and read the folders
        const installFolder = path_1.join(Config_1.default.readConfigValue("installFolder"), "installs");
        console.log("Reading installs from " + installFolder);
        const installs = fs_1.readdirSync(installFolder);
        let returned = [];
        for (let folder of installs) {
            const dataFilePath = path_1.join(installFolder, folder, "install.json");
            try {
                const fileContents = fs_1.readFileSync(dataFilePath, "utf8");
                const data = JSON.parse(fileContents);
                let screenshots = [];
                try {
                    screenshots = fs_1.readdirSync(path_1.join(installFolder, folder, "install")).filter(fn => {
                        return fn.match(/^screenshot(\d+)\.png$/);
                    });
                }
                catch (e) {
                    console.log("Could not load screenshots due to an IO error", e.message);
                }
                if (data.name) {
                    returned.push(new Install_1.default(data.name, folder, data.globalSave, screenshots));
                }
            }
            catch (e) {
                console.info("Failed to read install data from " + dataFilePath, e.message);
                console.log("Ignoring the folder.");
                // do nothing, the folder should be ignored
            }
        }
        return returned;
    }
}
exports.default = InstallList;
//# sourceMappingURL=InstallList.js.map