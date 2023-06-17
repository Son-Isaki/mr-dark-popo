const Events = window.Events = {

    // variables
    CharacterLoaded: 'addon.character.initialized',

    trigger: function (eventName, ...args) {
        const $this = this;

        $(document).trigger(eventName, ...args);
        $this.log(eventName, ...args);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.teal, 'Events', ...args);
    },

};