const Events = window.Events = {

    // variables
    CharacterLoaded: 'addon.character.loaded',
    CharactersLoaded: 'addon.characters.loaded',
    LevelsLoaded: 'addon.levels.loaded',

    ReloadInfosPersos: 'addon.infos-persos.reload',

    trigger: function (eventName, ...args) {
        const $this = this;

        $(document).trigger(eventName, ...args);
        $this.log(eventName, ...args);
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