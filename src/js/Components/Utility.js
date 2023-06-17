const Utility = window.Utility = {
    config: [
        'addon_timer_fight',
    ],
    fields: {},
    options: [
        // 'addon_auto_logger',
        'addon_add_fight_menu',
    ],
    settings: [],
    loaderOldContent: [],

    miniPersos: {
        'mini-60e02de3799cc-1.png': 'Muten Roshi',
    },
    safeZoneByPlanet: {
        'terre': 'https://' + document.domain + '/carte/move/59',
        'konoh': 'https://' + document.domain + '/carte/move/148',
        'bleas': 'https://' + document.domain + '/carte/move/717',
        'minipo': 'https://' + document.domain + '/carte/move/391',
        'konohaearth': 'https://' + document.domain + '/carte/move/328',
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

    getCurrentLifeCharacter: function () {
        return $('#filePV').attr('value');
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

    refreshInfoUser: function (html) {
        $('.zone1sub').html(html);
    },

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

    trim: function (str) {
        return str.replace(/\s{2,}/g, " ").trim();
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.indigo, 'Utility', ...args);
    },

};
