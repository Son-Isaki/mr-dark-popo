const Theme = window.Theme = {

    // variables

    init: function () {
        const $this = this;

        if (!LocalStorage.get(Options.OPTIONS.customThemeEnabled, false)) {
            return;
        }

        Utility.includeStyle('dist/css/theme.min.css')
        $this.initTopBar();

        $this.log("Initialized");

    },

    initTopBar: function () {
        $('.banniereSite').attr('src', Utility.getExtensionFilePath('dist/img/theme/logo.png'));

        let $navbar = $('#wrapper > .navbar');

        let $container = $('<div class="container">');

        $navbar.removeClass('narbar-light navSticky')
        let $navbarContent = $('#wrapper > .navbar > *')
            .appendTo($container);

        $container.appendTo($navbar);

        $('.mobileStopElargissement')
            .addClass('row content-wrapper')
            .removeClass('mobileStopElargissement');

        $('.zone1before')
            .addClass('col-md-3');

        $('.zone2')
            .addClass('col-md-9');

    },

    log: function (...args) {
        Logger.log(Logger.COLORS.amber, 'Theme', ...args);
    },
};