const Database = window.Database = {

    // variables
    domain: 'https://scan.isaki.fr/api/jeuheros',
    updateFrequency: 5, // minutes

    characters: [],

    init: function () {
        const $this = this;
    },

    getUpdateCharacters: function (callback) {
        const $this = this;

        let cookieName = 'characters';

        if (typeof Cookies.get(cookieName) !== 'undefined') {

            $this.characters = JSON.parse(Cookies.get(cookieName));
            $this.log('Characters', 'cookies', $this.characters);

            if (typeof callback === 'function') {
                callback();
            }

        } else {

            let data = {};
            $('.dropdown-menu .dropdown-menu .dropdown-item').each(function () {
                let icon = $(this).find('img:first-of-type').attr('src').replace('/uploads/miniPersos/', '');
                let displayName = $(this).text();
                let name = Utility.slugify(displayName);
                data[name] = icon;
            });

            $.ajax({
                type: 'PUT',
                url: $this.domain + '/characters',
                dataType: 'json',
                data: data,
                crossDomain: true,
            }).done(function (response) {

                $this.characters = response.response;
                $this.log('Characters', 'requested', $this.characters);

                let duration = 1 / (60 * 24 / $this.updateFrequency);
                Cookies.set(cookieName, JSON.stringify($this.characters), {expires: duration});

                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    },

    updateLevels: function (callback) {
        const $this = this;

        if (typeof callback === 'function') {
            callback();
        }
    },

    getLevels: function (callback) {
        const $this = this;

        if (typeof callback === 'function') {
            callback();
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeporange, 'Database', ...args);
    },

};