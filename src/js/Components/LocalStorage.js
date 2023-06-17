const LocalStorage = window.LocalStorage = {

    // variables

    /**
     * Get value from localStorage
     *
     * @param key
     * @param defaultValue
     * @returns {*|string}
     */
    get: function (key, defaultValue) {
        let value = localStorage.getItem(key);

        if (typeof value === 'undefined'){
            return defaultValue;
        }

        return value;
    },

    /**
     * Sets value to localStorage
     *
     * @param key
     * @param value
     */
    set: function (key, value) {
        localStorage.setItem(key, value);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.lime, 'LocalStorage', ...args);
    },
};