const Utility = window.Utility = {
    config: [
        'addon_timer_fight',
    ],
    fields: {},
    settings: [],
    loaderOldContent: [],

    urlSafeZoneByPlanet: {
        'terre': 'https://' + document.domain + '/carte/move/59',
        'konohss': 'https://' + document.domain + '/carte/move/148',
        'bleas': 'https://' + document.domain + '/carte/move/717',
        'minipo': 'https://' + document.domain + '/carte/move/391',
        'konohaearth': 'https://' + document.domain + '/carte/move/328',
        'namek': 'https://' + document.domain + '/carte/move/627',
    },

    urlFightZoneByPlanet: {
        'terre': 'https://' + document.domain + '/carte/move/68',
        'konohss': 'https://' + document.domain + '/carte/move/139',
        'bleas': 'https://' + document.domain + '/carte/move/716',
        'minipo': 'https://' + document.domain + '/carte/move/374',
        'konohaearth': 'https://' + document.domain + '/carte/move/329',
        'namek': 'https://' + document.domain + '/carte/move/626',
    },

    urlTrain: {
        'attaque': {
            map: 'https://www.jeuheros.fr/carte/move/69',
            action: 'https://www.jeuheros.fr/entrainementAttaque/go',
        },
        'defense': {
            map: 'https://www.jeuheros.fr/carte/move/59',
            action: 'https://www.jeuheros.fr/entrainementDefense/go',
        },
        'magie': {
            map: 'https://www.jeuheros.fr/carte/move/22',
            action: 'https://www.jeuheros.fr/entrainementMagie/go',
        },
    },

    characterLevels: {
        1: 50,
        12: 22000,
        13: 29000,
        14: 37000,
        15: 56000,
        16: 76000,
        17: 97000,
        18: 119000,
        19: 163000,
        20: 168213,
    },

    slugify: function (str) {
        str = str.replace(/^\s+|\s+$/g, '');
        // Make the string lowercase
        str = str.toLowerCase();
        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        // Remove invalid chars
        str = str.replace(/[^a-z0-9 ]/g, '')
            // Collapse whitespace and replace by -
            .replace(/\s+/g, '-')
            // Collapse dashes
            .replace(/-+/g, '-');
        return str;
    },

    getCurrentCharacterName: function (divHtml) {
        let tmp = $(divHtml).clone(true)[0];
        $(tmp).find('a').remove();
        $(tmp).find('span').remove();
        $(tmp).find('br').remove();

        let regex = /([A-Z]{1}[a-z]+ [\(a-zA-Z\)]+)/;
        let myRegex = new RegExp(regex, "gm")
        let matches = myRegex.exec(tmp.innerText);

        return matches;
    },

    getListFighter: function () {
        let $fighters = $('.fondBlancOnly table tr.couleurAlt');
    },

    getLabelField: function (option) {
        return chrome.i18n.getMessage(option);
    },

    getHTML: function (url, callback) {
        // Feature detection
        if (!window.XMLHttpRequest) return;

        // Create new request
        var xhr = new XMLHttpRequest();

        // Setup callback
        xhr.onload = function () {
            if (callback && typeof (callback) === 'function') {
                callback(this.responseXML);
            }
        };

        // Get the HTML
        xhr.open('GET', url);
        xhr.responseType = 'document';
        xhr.send();
    },

    getPageContent: async function (uri, success, error) {
        return $.ajax({
            url: uri,
            type: 'GET',
            success: success,
            error: error,
            crossDomain: true,
        })
    },

    // refreshInfoUser: function (html) {
    //     $('.zone1sub').html(html);
    //
    //     Addon.updateCharacterInfos();
    // },

    showLoader: function (selector) {
        const $this = this;
        let loader = $this.getExtensionFilePath('dist/img/loader.svg');

        let html = $('<img src="' + loader + '" style="width:24px;"/>');

        $(selector).html(html);
    },

    /**
     * Returns the full extension file path of a relative file path
     *
     * @param filepath
     */
    getExtensionFilePath: function (filepath) {
        const $this = this;

        let fullpath = filepath.trim('/');

        try {
            return chrome.runtime.getURL(fullpath);
        } catch (e) {
            $this.log(`Le fichier '${fullpath}' n'existe pas`);
            return undefined;
        }
    },

    /**
     * Loads and returns the content of a given file
     *
     * @param filepath
     */
    getExtensionFileContent: async function (filepath) {
        filepath = Utility.getExtensionFilePath(filepath);
        return fetch(filepath);
    },

    /**
     * Loads and returns the content of a given file as TEXT
     *
     * @param filepath
     */
    getExtensionFileAsText: async function (filepath) {
        return (await (await Utility.getExtensionFileContent(filepath)).text());
    },

    /**
     * Loads and returns the content of a given file as HTML
     *
     * @param filepath
     */
    getExtensionFileAsHtml: async function (filepath) {
        const $this = this;

        let html = await Utility.getExtensionFileAsText(filepath);
        let $content = $('<div>').append($(html));

        $content.find('img.fix-src').each(function () {
            $(this).attr('src', Utility.getExtensionFilePath($(this).attr('src')));
        });

        return $content.html();
    },

    /**
     * Loads and returns the content of a given file as JSON
     *
     * @param filepath
     */
    getExtensionFileAsJson: async function (filepath) {
        return (await (await Utility.getExtensionFileContent(filepath)).json());
    },

    /**
     * Include CSS file into DOM
     *
     * @param filepath
     */
    includeStyle: function (filepath) {
        const $this = this;

        if (filepath.indexOf('http') === -1) {
            filepath = $this.getExtensionFilePath(filepath);
        }

        if (typeof filepath !== 'undefined') {
            $("<link>")
                .attr('type', 'text/css')
                .attr('rel', 'stylesheet')
                .attr('href', filepath)
                .appendTo('head')
            $this.log(`File included: ${filepath}`)
        }
    },

    /**
     * Include Javascript file into DOM
     *
     * @param filepath
     */
    includeScript: function (filepath) {
        const $this = this;

        let path = $this.getExtensionFilePath(filepath);
        if (typeof path !== 'undefined') {
            $("<script>")
                .attr('type', 'text/javascript')
                .attr('src', path)
                .appendTo('head')
            $this.log(`File included: ${path}`)
        }
    },

    /**
     * Include CSS string into DOM
     *
     * @param style
     */
    injectStyle: function (style) {
        $("<style>")
            .attr('type', 'text/css')
            .text(style)
            .appendTo('head')
    },

    hideLoader: function (selector, newContent) {
        $(selector).html(newContent);
    },

    createFilter: function (label, dataType, checked, $parent) {
        let $label = $('<label class="btn-filter">')
            .appendTo($parent)

        let $input = $('<input type="checkbox">')
            .attr('data-type', dataType)
            .addClass(dataType)
            .prop('checked', checked)
            .appendTo($label)

        $('<span>')
            .text(label)
            .appendTo($label)

        return $input;
    },

    checkPlanetForCurrentCharacter: function (planet) {
        const $this = this;

        let $characterHtml = $('.dropdown-item:contains("'+Addon.currentCharacter.name+'")');

        $this.log('characterHtml for checkPlanet', $characterHtml);
        let imgs = $characterHtml.find('img');

        let $imgPlanet = imgs
            .eq(1)
            .attr('src');

        if ($imgPlanet.indexOf(planet) !== -1) {
            return true
        }

        return false;
    },

    getCurrentPlanetCurrentCharacter: function () {
        const $this = this;

        let $characterHtml = $('.dropdown-item:contains("'+Addon.currentCharacter.name+'")');

        $this.log('characterHtml for checkPlanet', $characterHtml);
        let imgs = $characterHtml.find('img');

        let $imgPlanet = imgs
            .eq(1)
            .attr('src');

        let planet = null;

        // On récupère le lien/la case de safe zone correspondant à la planète
        $.each(Utility.urlFightZoneByPlanet, function (key, linkPlanet) {
            let index = $imgPlanet.indexOf(key);

            if (index !== -1 && planet === null) {
                planet = key;
            }
        });

        return planet;
    },

    getPlanetCharacterFromList: function (item) {
        const $this = this;

        let imgs = $(item).find('img');

        let $imgPlanet = imgs
            .eq(1)
            .attr('src');

        if ($imgPlanet === undefined) {
            return false;
        }

        let planet = null;

        // On récupère le lien/la case de safe zone correspondant à la planète
        $.each(Utility.urlFightZoneByPlanet, function (key, linkPlanet) {
            let index = $imgPlanet.indexOf(key);

            if (index !== -1 && planet === null) {
                planet = key;
            }
        });

        return planet;
    },

    createSubmitButton: function (content) {
        return $('<button class="btn-text btn-primary" type="submit">' + content + '</button>');
    },

    trim: function (str) {
        return str.replace(/\s{2,}/g, " ").trim();
    },

    formatNumber: function (value) {
        return new Intl.NumberFormat('locale').format(value);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.indigo, 'Utility', ...args);
    },

};
