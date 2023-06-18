const Events = window.Events = {

    // variables
    CharacterLoaded: 'addon.character.initialized',
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