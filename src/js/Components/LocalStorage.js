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
        const $this = this;

        let value = undefined;

        // cookie deprecated
        if (Cookies.get(key) !== undefined) {
            value = Cookies.get(key);
            $this.set(key, value);
            Cookies.remove(key);
        }

        // localStorage
        value = localStorage.getItem(key);
        $this.log('getItem : ', key, 'value : ', value, typeof value);
        if (value === 'null') {
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
        const $this = this;

        localStorage.setItem(key, value);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.lime, 'LocalStorage', ...args);
    },
};