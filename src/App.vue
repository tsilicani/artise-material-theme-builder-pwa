<template>
    <v-app>
        <v-dialog v-model="dialog" max-width="600">
            <v-card width="100%">
                <v-toolbar dense>
                    <v-btn icon @click="$refs.uploader.click()">
                        <input type="file" @change="loadFromFile" ref="uploader" class="d-none">
                        <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                    <v-btn icon v-clipboard:copy="exp" v-clipboard:success="onCopy" v-clipboard:error="onError">
                        <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                    <v-btn icon @click="save()">
                        <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon @click=" dialog=false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="mt-4"><code>{{exp}}</code></v-card-text>
            </v-card>
        </v-dialog>
        <v-navigation-drawer v-model="drawer" app overflow>
            <v-list-item v-if="installBtn" @click="installer()">
                <v-list-item-action>
                    <v-icon>mdi-file-download-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Install</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider v-if="installBtn"></v-divider>
            <v-list v-if="!tool" dense>
                <v-list-item v-if="!isMobile" link @click="settings.isMobile=!settings.isMobile">
                    <v-list-item-action>
                        <v-icon>{{settings.isMobile?'mdi-cellphone':'mdi-desktop-mac'}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Width</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider v-if="!isMobile"></v-divider>
                <v-list-item link @click="settings.appIsDark=!settings.appIsDark">
                    <v-list-item-action>
                        <v-icon>mdi-invert-colors</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Main</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="settings.systemBarIsDark=!settings.systemBarIsDark">
                    <v-list-item-action>
                        <v-icon>mdi-invert-colors</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>System Bar</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="settings.appBarIsDark=!settings.appBarIsDark">
                    <v-list-item-action>
                        <v-icon>mdi-invert-colors</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>App Bar</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item link @click="settings.appBarIsSmall=!settings.appBarIsSmall">
                    <v-list-item-action>
                        <v-icon>{{settings.appBarIsSmall?'mdi-arrow-down-drop-circle-outline':'mdi-arrow-up-drop-circle-outline'}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>App Bar</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item link @click="openPicker(); colorElement='systemBar'">
                    <v-list-item-action>
                        <v-icon :color="settings.colors.systemBar">mdi-circle</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>System Bar</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-for="item in components" :key="item.index" link @click="tool='select'; contentElement=item">
                    <v-list-item-action>
                        <v-icon :color="componentColor(item)">mdi-circle</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="text-capitalize">{{item}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="item in colorElements" :key="item.index" link @click="openPicker(); colorElement=item">
                    <v-list-item-action>
                        <v-icon :color="settings.colors[theme][item]">mdi-circle</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="text-capitalize">{{item}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-card v-if="tool=='color'" color="grey lighten-4" flat height="200px" tile>
                <v-toolbar dense>
                    <v-toolbar-title class="text-capitalize">{{colorElement}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="tool=false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-color-picker v-model="color" class="caption" show-swatches></v-color-picker>
            </v-card>
            <v-card v-if="tool=='select'" color="grey lighten-4" flat height="200px" tile>
                <v-toolbar dense>
                    <v-toolbar-title class="text-capitalize">Select Color</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="tool=false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-list dense>
                    <v-list-item v-for="item in colorElements" :key="item.index" link @click="settings.componentsColor[theme][contentElement]=item">
                        <v-list-item-action>
                            <v-icon :color="settings.colors[theme][item]">mdi-circle</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="text-capitalize">{{item}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-navigation-drawer>
        <v-content>
            <v-app-bar dense collapse-on-scroll app>
                <v-btn @click.stop="drawer = !drawer" icon>
                    <v-icon>mdi-palette-advanced</v-icon>
                </v-btn>
                <v-toolbar-title><span class="title ml-3 mr-5">Artise&nbsp;<span class="font-weight-light">Themer</span></span></v-toolbar-title>
                <v-spacer></v-spacer>
                <template>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" @click.stop="dialog = true" icon>
                                <v-icon>mdi-file-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Import or Export Theme</span>
                    </v-tooltip>
                </template>
            </v-app-bar>
            <v-container fluid>
                <v-card :dark="settings.appIsDark" :max-width="width" class="mt-2 mx-auto">
                    <v-system-bar :dark="settings.systemBarIsDark" :light="!settings.systemBarIsDark" :color="settings.colors.systemBar" height="30" :lights-out="false" :window="false">
                        <v-icon>mdi-email</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>mdi-wifi-strength-4</v-icon>
                        <v-icon>mdi-signal-cellular-outline</v-icon>
                        <v-icon>mdi-battery</v-icon>
                        <span>12:34</span>
                    </v-system-bar>
                    <v-toolbar :color="componentColor('appBar')" dense :dark="settings.appBarIsDark" :light="!settings.appBarIsDark">
                        <v-app-bar-nav-icon></v-app-bar-nav-icon>
                        <v-toolbar-title>Page title</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                        <template v-if="!settings.appBarIsSmall" v-slot:extension>
                            <v-fab-transition>
                                <v-btn :color="componentColor('floatingButton')" fab dark small absolute bottom right>
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-fab-transition>
                        </template>
                    </v-toolbar>
                    <v-card-title class="display-1 mt-4">Far Far Away</v-card-title>
                    <v-card-text><span class="subtitle-1">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to</span>
                    </v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text>
                        <v-row class="text-center">
                            <v-col>
                                <v-btn light :color="componentColor('buttons')">Normal</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn depressed :color="componentColor('buttons')">Depressed</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn rounded :color="componentColor('buttons')">Rounded</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn outlined :color="componentColor('buttons')">Outlined</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn disabled :color="componentColor('buttons')">Disabled</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn text :color="componentColor('buttons')">Text</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text>
                        <v-row class="text-center">
                            <v-col>
                                <v-icon :color="settings.colors[theme].primary" class="mb-1">mdi-account-circle</v-icon><br>Primary
                            </v-col>
                            <v-col>
                                <v-icon :color="settings.colors[theme].accent" class="mb-1">mdi-plus-circle</v-icon><br>Accent
                            </v-col>
                            <v-col>
                                <v-icon :color="settings.colors[theme].secondary" class="mb-1">mdi-help-circle</v-icon><br>Secondary
                            </v-col>
                            <v-col>
                                <v-icon :color="settings.colors[theme].success" class="mb-1">mdi-check-circle</v-icon><br>Success
                            </v-col>
                            <v-col>
                                <v-icon :color="settings.colors[theme].info" class="mb-1">mdi-information</v-icon><br>Info
                            </v-col>
                            <v-col>
                                <v-icon :color="settings.colors[theme].warning" class="mb-1">mdi-alert-circle</v-icon><br>Warning
                            </v-col>
                            <v-col>
                                <v-icon :color="settings.colors[theme].error" class="mb-1">mdi-close-circle</v-icon><br>Error
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-container>
        </v-content>
        <v-footer :inset="true" app>
            <span class="px-4 mx-auto caption">Made with <v-icon x-small color="error">mdi-heart</v-icon> from <a target="_blank" class="blue--text no-underline" href="https://www.linkedin.com/in/tobias-m-silicani/">Tobias M. Silicani</a></span><!-- <span class="px-4">&copy; {{ new Date().getFullYear() }}</span> -->
        </v-footer>
    </v-app>
</template>
<script>
const FileSaver = require('file-saver')

export default {
    name: 'app',
    title: 'Artise Themer - Material Theme Builder',
    data() {
        return {
            colorElements: ['primary', 'accent', 'secondary', 'success', 'info', 'warning', 'error'],
            components: ['appBar', 'buttons', 'floatingButton'],
            settings: {
                componentsColor: {
                    light: {
                        appBar: '',
                        buttons: '',
                        floatingButton: ''
                    },
                    dark: {
                        appBar: '',
                        buttons: '',
                        floatingButton: ''
                    }
                },
                colors: {
                    systemBar: "#e0e0e0",
                    light: {
                        primary: '#1976D2',
                        secondary: '#424242',
                        accent: '#82B1FF',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    },
                    dark: {
                        primary: '#1976D2',
                        secondary: '#424242',
                        accent: '#82B1FF',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    },
                },
                isMobile: false,
                systemBarIsDark: false,
                appIsDark: false,
                appBarIsDark: false,
                appBarIsSmall: false,
            },
            colorElement: undefined,
            contentElement: undefined,
            tool: undefined,
            drawer: null,
            installBtn: false,
            installer: undefined,
            onTop: true,
            dialog: false,
            isMobile: undefined
        }
    },
    computed: {
        navigation() {
            return Object.values(this.settings.colors).filter(color => color.selected)
        },
        theme() {
            return this.settings.appIsDark ? 'dark' : 'light'
        },
        color: {
            get() {
                return this.colorElement == 'systemBar' ? this.settings.colors.systemBar : this.settings.colors[this.theme][this.colorElement]
            },
            set(value) {
                if (value) {
                    if (this.colorElement == 'systemBar') {
                        this.settings.colors.systemBar = value
                    } else {
                        this.settings.colors[this.theme][this.colorElement] = value
                    }
                }
            },
        },
        width() {
            return this.settings.isMobile ? '400' : '1200'
        },
        exp() {
            return JSON.stringify(this.settings.colors, null, '\t')
        },
    },
    methods: {
        openPicker() {
            this.color = undefined
            this.tool = 'color'
        },
        closePicker() {
            this.tool = false
        },
        copy(str) {
            const el = document.createElement('textarea');
            el.value = str;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        },
        onCopy: function(e) {
            console.log('You just copied: ' + e.text)
        },
        onError: function(e) {
            console.log('Failed to copy texts', e)
        },
        save() {
            const blob = new Blob([JSON.stringify(this.settings)], { type: "text/plain;charset=utf-8" });
            FileSaver(blob, "artise-theme.json");
        },
        loadFromFile(ev) {
            const file = ev.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.settings = JSON.parse(reader.result)
            }
            reader.readAsText(file)
        },
        componentColor(component) {
            return this.settings.colors[this.theme][this.settings.componentsColor[this.theme][component]]
        },
        onResize() {
            this.isMobile = window.innerWidth < 600
        }
    },
    created() {
        let installPrompt;
        window.addEventListener("beforeinstallprompt", e => {
            e.preventDefault()
            installPrompt = e
            this.installBtn = Boolean(installPrompt)
        })
        this.installer = () => {
            this.installBtn = false;
            installPrompt.prompt();
            installPrompt.userChoice.then(result => {
                if (result.outcome === "accepted") {
                    console.log("Install accepted!")
                } else {
                    console.log("Install denied!")
                }
            })
        }
    },
    mounted() {
        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
    }
}
</script>
<style>
.v-color-picker__swatches {
    max-height: none !important;
}

.v-overlay {
    display: none !important;
}

.no-underline {
    text-decoration: none;
}

.v-toolbar__title {
    padding-left: 0px !important;
}

code {
    width: 100% !important;
    color: inherit !important;
    color: #333 !important;
}
</style>