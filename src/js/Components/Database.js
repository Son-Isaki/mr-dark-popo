const Database = window.Database = {

    // variables
    domain: 'https://scan.isaki.fr/api/jeuheros',
    updateFrequency: 5, // minutes
    cookieName: 'database-alive',

    characters: {},
    levels: {},

    init: function () {
        const $this = this;
    },

    getUpdateCharacters: function (callback) {
        const $this = this;

        let storageKey = 'characters-data';

        if (Cookies.get($this.cookieName) !== undefined && LocalStorage.get(storageKey, null) !== null) {

            $this.characters = JSON.parse(LocalStorage.get(storageKey, null));
            $this.log('Characters', 'cookies', $this.characters);

            if (typeof callback === 'function') {
                callback();
            }

        } else {

            let data = {};
            $('.dropdown-menu .dropdown-menu .dropdown-item').each(function () {
                let icon = $(this).find('img:first-of-type').attr('src').replace('/uploads/miniPersos/', '');
                let name = Utility.trim($(this).text());
                let slug = Utility.slugify(name);
                data[slug] = {
                    slug: slug,
                    name: name,
                    icon: icon,
                };
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

                LocalStorage.set(storageKey, JSON.stringify(response.response));

                let duration = 1 / (60 * 24 / $this.updateFrequency);
                Cookies.set($this.cookieName, true, {expires: duration});

                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    },

    updateLevels: function (callback) {
        const $this = this;

        let storageKey = 'levels-data';

        if (Cookies.get($this.cookieName) !== undefined && LocalStorage.get(storageKey, null) !== null) {

            $this.levels = JSON.parse(LocalStorage.get(storageKey, null));
            $this.log('Levels', 'cookies', $this.levels);

            if (typeof callback === 'function') {
                callback();
            }

        } else {

            let data = {};
            $('.flexCharacterList .cadrePersoList').each(function () {
                let $card = $(this);
                let level = parseInt($card.find('table:first-of-type td').text().split(' ')[1]);
                let experience = parseInt($card.find('table:last-of-type td:last-child').text().split('/')[1]);
                data[level] = experience;
            });

            $.ajax({
                type: 'PUT',
                url: $this.domain + '/levels',
                dataType: 'json',
                data: data,
                crossDomain: true,
            }).done(function (response) {

                $this.levels = response.response;
                $this.log('Levels', 'requested', $this.levels);

                LocalStorage.set(storageKey, JSON.stringify(response.response));

                let duration = 1 / (60 * 24 / $this.updateFrequency);
                Cookies.set($this.cookieName, true, {expires: duration});

                if (typeof callback === 'function') {
                    callback();
                }
            });

        }

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