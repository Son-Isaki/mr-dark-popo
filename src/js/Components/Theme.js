const Theme = window.Theme = {

    // variables
    customThemeEnabled: false,

    init: function () {
        const $this = this;

        $this.customThemeEnabled = LocalStorage.get(Options.OPTIONS.customThemeEnabled, false);

        if (!$this.customThemeEnabled) {
            return;
        }

        Utility.includeStyle('dist/css/theme.min.css')

        $this.bind();

        $this.initTopBar();
        $this.initAvatars();
        $this.initProgressBars();

        $this.log("Initialized");

    },

    bind: function(){
        const $this = this;

        Events.register(Events.ReloadInfosPersos, function () {
            $this.initAvatars();
            $this.initProgressBars();
        });
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

    initAvatars: function () {
        const $this = this;

        if (!$this.customThemeEnabled) {
            return;
        }

        $('.imgPersoActuel').each(function () {
            let $avatar = $(this);

            let $container = $('<div class="character-avatar small">')
                .insertAfter($avatar);

            let $background = $('<img class="background">')
                .attr('src', $avatar.attr('src'))
                .appendTo($container);

            let $effect = $('<img class="effect">')
                .attr('src', Utility.getExtensionFilePath('dist/img/theme/avatar-effect.jpg'))
                .appendTo($container);

            $avatar
                .removeClass('imgPersoActuel')
                .addClass('avatar')
                .appendTo($container);
        });
        $('.absoluDivAvatar').each(function () {
            let $container = $(this)
                .removeClass('absoluDivAvatar')
                .addClass('character-avatar');

            let $avatar = $(this).find('img');

            $avatar
                .removeClass('infoPersoAvatar borderPersoAvatar')
                .addClass('avatar');

            let $background = $('<img class="background">')
                .attr('src', $avatar.attr('src'))
                .appendTo($container);

            let $effect = $('<img class="effect">')
                .attr('src', Utility.getExtensionFilePath('dist/img/theme/avatar-effect.jpg'))
                .appendTo($container);

            $container.find('p')
                .addClass('eveil')

            $avatar
                .removeClass('imgPersoActuel')
                .addClass('avatar')
                .appendTo($container);
        });
    },

    initProgressBars: function () {
        const $this = this;

        if (!$this.customThemeEnabled) {
            return;
        }

        $('#filePV, .cadrePersoList progress:first').addClass('red');
        $('#file, .expBarInfoPerso').addClass('blue');
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.amber, 'Theme', ...args);
    },
};