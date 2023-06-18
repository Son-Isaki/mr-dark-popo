const Theme = window.Theme = {

    // variables
    customThemeEnabled: false,

    init: function () {
        const $this = this;

        if (LocalStorage.get(Options.OPTIONS.customThemeEnabled, 'false') === 'false') {
            return false;
        }

        $this.customThemeEnabled = true;

        Utility.includeStyle('dist/css/theme.min.css')

        $this.bind();

        setTimeout(function(){
            $this.initTopBar();
            $this.initAvatars();
        }, 10);

        $this.log("Initialized");

    },

    bind: function () {
        const $this = this;

        Events.register(Events.ReloadInfosPersos, function () {
            $this.initAvatars();
            $this.initProgressBars();
        });

        Events.register(Events.LevelsLoaded, function () {
            $this.initProgressBars();
            // $this.initInfosPerso();
        });
    },

    initInfosPerso: function(){
        const $this = this;

        let $container = $('<div class="infos-perso-row">')
            .prependTo($('.zone1sub'));

        $('.imgPersoActuelDiv')
            .appendTo($container);

        $('.zone1sub .couleurBlack')
            .appendTo($container)
            .find('br').remove();

        let tmp = $('.imgPersoActuelDiv')[0];
        $this.log(tmp);
        // tmp.innerHTML = string;
        let lst = [];
        for (let i = 0; i < tmp.childNodes.length; i++) {
            if (tmp.childNodes[i].nodeType === Node.TEXT_NODE) {
                let text = Utility.trim(tmp.childNodes[i].nodeValue);
                if (text !== '') {
                    lst.push(text);
                }
                tmp.childNodes[i].remove()
            }
        }
        $this.log(lst);

        let name = lst[0];
        let level = lst[1];

        $('<p>')
            .text(level)
            .prependTo($('.zone1sub .couleurBlack'));

        $('<h3>')
            .text(name)
            .prependTo($('.zone1sub .couleurBlack'));
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

        $('#navbarColor02 > ul > li > .dropdown-menu > a.dropdown-toggle')
            .remove();
    },

    initAvatars: function () {
        const $this = this;

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
        $('.absoluDivAvatar, .flexProfilJoueurPourBan').each(function () {
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

        // $('#filePV, .cadrePersoList progress:first').addClass('red');
        // $('#file, .expBarInfoPerso').addClass('blue');

        let callback = (e) => {
            let characterInfos = Addon.characterInfos;
            // $this.log('characterInfos', characterInfos)

            $('#filePV, .cadrePersoList #filePV').each(function () {

                let lifeCurrent = characterInfos.lifeCurrent;
                let lifeMax = characterInfos.lifeMax;
                let $parent = null;

                // liste de persos
                $parent = $(this).parents('.cadrePersoList');
                ;
                if ($parent.length > 0) {
                    let segs = $parent.find('.centerTexte').eq(1).find('td:last-child').text().split('/');
                    lifeCurrent = parseInt(segs[0]);
                    lifeMax = parseInt(segs[1]);
                    $parent.find('.centerTexte').eq(1).remove();
                }

                // infos perso
                $this.createProgressBar($(this), 'life', true, lifeCurrent, lifeMax);

                $(this).remove();
                $('[for="filePV"]').remove();
            });
            $('#file, .cadrePersoList #file').each(function () {

                let experienceCurrent = characterInfos.experienceCurrent;
                let experienceMax = characterInfos.experienceMax;
                let $parent = null;

                // infos perso
                $parent = $(this).parents('.zone1sub');
                if ($parent.length > 0) {
                    let segs = Utility.trim($parent.find('.imgPersoActuelDiv').text()).split(' ');
                    let level = parseInt(segs[segs.length - 1]);

                    let levelObj = Database.levels[level];
                    let levelObjSub = Database.levels[level - 1];
                    if (typeof levelObjSub === 'undefined') {
                        levelObjSub = {
                            level: 0,
                            experience: 0,
                        }
                    }

                    experienceCurrent = parseInt($(this).attr('value')) - levelObjSub.experience;
                    experienceMax = levelObj.experience - levelObjSub.experience;

                    // $this.log('level', $parent.find('h5').text(), level, levelObj);
                    // $this.log('edited', $parent.find('h5').text(), experienceCurrent, experienceMax);
                }

                // liste de persos
                $parent = $(this).parents('.cadrePersoList');
                if ($parent.length > 0) {
                    let segs = Utility.trim($parent.find('.centerTexte').eq(0).find('td:last-child').text()).split(' ');
                    let level = parseInt(segs[segs.length - 1]);

                    let levelObj = Database.levels[level];
                    let levelObjSub = Database.levels[level - 1];
                    if (typeof levelObjSub === 'undefined') {
                        levelObjSub = {
                            level: 0,
                            experience: 0,
                        }
                    }

                    experienceCurrent = parseInt($(this).attr('value')) - levelObjSub.experience;
                    experienceMax = levelObj.experience - levelObjSub.experience;

                    $this.log('level', $parent.find('h5').text(), level, levelObj);
                    $this.log('edited', $parent.find('h5').text(), experienceCurrent, experienceMax);

                    $parent.find('.centerTexte').eq(1).remove();
                }

                $this.createProgressBar($(this), 'experience', true, experienceCurrent, experienceMax);

                $(this).remove();
                $('[for="file"]').remove();
            });

            // $('.cadrePersoList progress:first').each(function () {
            //     $this.createProgressBar($(this), 'life', true, characterInfos.lifeCurrent, characterInfos.lifeMax);
            // });
            // $('.expBarInfoPerso').each(function () {
            //     $this.createProgressBar($(this), 'experience', true, characterInfos.experienceCurrent, characterInfos.experienceMax);
            // });

            $this.initInfosPerso();
        };

        Events.register(Events.CharacterLoaded, callback);
        Events.register(Events.ReloadInfosPersos, callback);
    },

    createProgressBar: function ($parent, type, full, valueCurrent, valueMax) {
        let $container = $('<div class="progressbar">')
            .addClass(type)
            .insertAfter($parent);

        let $background = $('<div class="background">')
            .appendTo($container);

        let percent = (valueCurrent / valueMax * 100);

        let $value = $('<div class="value">')
            .css('width', `${percent}%`)
            .appendTo($container);

        let $text = $('<div class="text">')
            .text(`${Utility.formatNumber(valueCurrent)} / ${Utility.formatNumber(valueMax)}`)
            .appendTo($container);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.amber, 'Theme', ...args);
    },
};