const Events = window.Events = {

    // variables
    CharacterLoaded: 'addon.character.loaded',
    ReloadInfosPersos: 'addon.infos-persos.reload',

    CharactersLoaded: 'addon.characters.loaded',
    LevelsLoaded: 'addon.levels.loaded',

    AvatarFrameCreated: 'addon.frame.created',

    AutoFightSwitchChar: 'addon.autofight.switch.character',
    AutoFightStartCharFight: 'addon.autofight.start.character',

    trigger: function (eventName, ...args) {
        const $this = this;

        $this.log(eventName, ...args);
        $(document).trigger(eventName, ...args);
    },

    register: function (eventName, callback) {
        $(document).on(eventName, callback);
    },

    unregister: function (eventName, callback) {
        $(document).off(eventName, callback);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.teal, 'Events', ...args);
    },

};