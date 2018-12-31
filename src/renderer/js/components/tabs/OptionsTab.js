const OptionsTab = Vue.component("ddmm-options-tab", {
    "template": `
<div class="page-content">
    <div class="mod-viewer-pane">
        <div class="mod-viewer-mod-list">
            <template v-for="section in menu">
                <div class="mod-view-mod-list-title">{{section.header}}</div>
                <div v-for="item in section.contents" :class="{'mod-view-mod-list-entry': true, 'active': selected_option === item.id}" @click="selectOption(item.id)">{{item.title}}</div>
                <br>
            </template>
        </div>
        <div class="mod-viewer-mod-display">
            <div v-if="selected_option === 'background'">
                <h1>{{_("renderer.tab_options.section_backgrounds.title")}}</h1>
                <p>{{_("renderer.tab_options.section_backgrounds.subtitle")}}</p>
                
                <br>
                
                <div class="screenshots">                       
                    <!--suppress RequiredAttributes, HtmlRequiredAltAttribute -->
                    <img v-for="img in backgrounds" :alt="img" :src="'../images/backgrounds/' + img" width="150" @click="setBackground(img)">
                </div>
                
                <br>
                
                <button class="danger" @click="setBackground('none')">{{_("renderer.tab_options.section_backgrounds.button_none")}}</button>
                
                <br><br>
                
                <p>{{_("renderer.tab_options.section_backgrounds.description_credit")}}</p>
            </div>
            <div v-else-if="selected_option === 'storage'">
                <h1>{{_("renderer.tab_options.section_storage.title")}}</h1>
                <p>{{_("renderer.tab_options.section_storage.subtitle")}}</p>
                <br>
                <p><strong>{{_("renderer.tab_options.section_storage.description_moving")}}</strong></p>
                <br>
                <p>{{_("renderer.tab_options.section_storage.description_current", installFolder)}}</p>
                <br>
                <button class="primary" @click="moveInstall">{{_("renderer.tab_options.section_storage.button_change")}}</button>
            </div>
            <div v-else-if="selected_option === 'sdk'">
                <h1>{{_("renderer.tab_options.section_sdk.title")}}</h1>
                <p>{{_("renderer.tab_options.section_sdk.subtitle")}}</p>
                <br>
                <p><strong>{{_("renderer.tab_options.section_sdk.description_mode")}}</strong></p>
                <p><label><input type="radio" name="sdk_mode_checkbox" value="always" v-model="sdk_mode_interim" @change="updateSDKMode"> {{_("renderer.tab_options.section_sdk.checkbox_always")}}</label></p>
                <p><label><input type="radio" name="sdk_mode_checkbox" value="specified" v-model="sdk_mode_interim" @change="updateSDKMode"> {{_("renderer.tab_options.section_sdk.checkbox_specified")}}</label></p>
                <p><label><input type="radio" name="sdk_mode_checkbox" value="never" v-model="sdk_mode_interim" @change="updateSDKMode"> {{_("renderer.tab_options.section_sdk.checkbox_never")}}</label></p>                
            </div>
            <div v-else-if="selected_option === 'discord'">
                <h1>{{_("renderer.tab_options.section_discord.title")}}</h1>
                <p>{{_("renderer.tab_options.section_discord.subtitle")}}</p>
                <br>
                <p><strong>{{_("renderer.tab_options.section_discord.description")}}</strong></p>
                <br>
                <button class="danger" v-if="richPresenceEnabled()" @click="setRichPresence(false)">{{_("renderer.tab_options.section_discord.button_disable")}}</button>
                <button class="success" v-else @click="setRichPresence(true)">{{_("renderer.tab_options.section_discord.button_enable")}}</button>
            </div>
            <div v-else-if="selected_option === 'testing'">
                <h1>{{_("renderer.tab_options.section_testing.title")}}</h1>
                <p>{{_("renderer.tab_options.section_testing.subtitle")}}</p>
                <br>
                <button class="danger" v-if="sdkDebuggingEnabled()" @click="setSDKDebugging(false)">{{_("renderer.tab_options.section_testing.button_disable")}}</button>
                <button class="success" v-else @click="setSDKDebugging(true)">{{_("renderer.tab_options.section_testing.button_enable")}}</button>
            </div>
            <div v-else-if="selected_option === 'debug'">
                <h1>{{_("renderer.tab_options.section_debug.title")}}</h1>
                <p>{{_("renderer.tab_options.section_debug.subtitle")}}</p>
                <br>
                <p v-for="(v, k) in debug_info">
                    <strong>{{k}}:</strong> <span>{{v}}</span>
                </p>
            </div>
        </div>
    </div>
</div>
        `,
    "data": function () {
        return {
            "debug_info": ddmm.debug,
            "selected_option": sessionStorage.getItem("options_last_id"),
            "backgrounds": ddmm.app.getBackgrounds(),
            "sdk_mode_interim": ddmm.config.readConfigValue("sdkMode"),
            "menu": [
                {
                    "header": ddmm.translate("renderer.tab_options.list.header_application"),
                    "contents": [
                        {"title": ddmm.translate("renderer.tab_options.list.link_storage"), "id": "storage"}
                    ]
                },
                {
                    "header": ddmm.translate("renderer.tab_options.list.header_appearance"),
                    "contents": [
                        {"title": ddmm.translate("renderer.tab_options.list.link_background"), "id": "background"}
                    ]
                },
                {
                    "header": ddmm.translate("renderer.tab_options.list.header_enhancements"),
                    "contents": [
                        {"title": ddmm.translate("renderer.tab_options.list.link_sdk"), "id": "sdk"},
                        {"title": ddmm.translate("renderer.tab_options.list.link_discord"), "id": "discord"}
                    ]
                },
                {
                    "header": ddmm.translate("renderer.tab_options.list.header_developers"),
                    "contents": [
                        {"title": ddmm.translate("renderer.tab_options.list.link_testing"), "id": "testing"},
                        {"title": ddmm.translate("renderer.tab_options.list.link_debug"), "id": "debug"}
                    ]
                }
            ]
        }
    },
    "computed": {
        "installFolder": function () {
            return ddmm.config.readConfigValue("installFolder");
        }
    },
    "methods": {
        "_": ddmm.translate,
        "moveInstall": ddmm.app.beginMoveInstall,
        "selectOption": function (option) {
            this.selected_option = option;
            sessionStorage.setItem("options_last_id", option);
        },
        "setBackground": function (background) {
            ddmm.config.saveConfigValue("background", background);
            this.$emit("set_background", background);
        },
        "richPresenceEnabled": function () {
            return ddmm.config.readConfigValue("discordEnabled");
        },
        "sdkDebuggingEnabled": function () {
            return ddmm.config.readConfigValue("sdkDebuggingEnabled");
        },
        "setRichPresence": function (enabled) {
            ddmm.config.saveConfigValue("discordEnabled", !!enabled);
            this.$forceUpdate();
        },
        "setSDKDebugging": function (enabled) {
            ddmm.config.saveConfigValue("sdkDebuggingEnabled", !!enabled);
            this.$forceUpdate();
        },
        "updateSDKMode": function () {
            ddmm.config.saveConfigValue("sdkMode", this.sdk_mode_interim);
        }
    },
    "mounted": function () {
        if (!this.selected_option) {
            this.selected_option = this.menu[0].contents[0].id;
        }
    }
});