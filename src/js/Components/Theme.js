const Theme = window.Theme = {

    // variables

    init: function () {
        const $this = this;

        if (LocalStorage.get(Options.OPTIONS.customThemeEnabled, 'false') === 'false') {
            return false;
        }

        Utility.includeStyle('dist/css/theme.min.css')

        $this.bind();

        $this.initTopBar();
        $this.initInfosPerso();

        $this.log("Initialized");

    },

    /**
     * Bind les événements utiles à ce composant
     */
    bind: function () {
        const $this = this;

        Events.register(Events.CharacterLoaded, function () {
            let $container = $('.infos-perso-container');
            $this.injectCharacterData($container, Addon.currentCharacter);
        });
    },

    /**
     * Initialize le bloc infos perso au chargement de la page
     * => Remplace le HTML du bloc infos perso par une structure custom
     */
    initInfosPerso: async function () {
        const $this = this;

        let html = await Utility.getExtensionFileAsHtml('dist/html/infos-perso.html');
        $(html).insertAfter('.zone1sub');

        $('.zone1sub').remove();
    },

    /**
     * Met à jour les informations du bloc infos perso
     */
    updateInfosPerso: function (content) {
        const $this = this;

        let character = new Character(content);
        Addon.currentCharacter = character = Avatar.AddCustomAvatarToCharacter(character)
        let $container = $('.infos-perso-container');
        $this.injectCharacterData($container, character);
    },

    /**
     * Inject les informations données dans le bloc infos perso
     */
    injectCharacterData: function ($container, character) {
        const $this = this;

        $container.find('.clan').text(character.clanName);
        $container.find('.name').text(character.name);
        $container.find('.level').text(character.level);

        $container.find('.character-avatar .avatar, .character-avatar .background').attr('src', character.avatar);

        $container.find('.life .current').text(Utility.formatNumber(character.lifeCurrent));
        $container.find('.life .max').text(Utility.formatNumber(character.lifeMax));
        $container.find('.life .value').css('width', `${character.lifeCurrent / character.lifeMax * 100}%`);

        $container.find('.experience .current').text(Utility.formatNumber(character.experienceCurrent));
        $container.find('.experience .max').text(Utility.formatNumber(character.experienceMax));
        $container.find('.experience .value').css('width', `${character.experienceCurrent / character.experienceMax * 100}%`);

        $container.find('.zenis').text(Utility.formatNumber(character.zenis));
        $container.find('.energy-atk').text(Utility.formatNumber(character.energyAtk));
        $container.find('.energy-def').text(Utility.formatNumber(character.energyDef));
        $container.find('.energy-mag').text(Utility.formatNumber(character.energyMag));
        $container.find('.energy-acc').text(Utility.formatNumber(character.energyAcc));
        $container.find('.energy-ext').text(Utility.formatNumber(character.energyExt));

        $container.find('.link-select').attr('href', character.linkSelect);

        if (character.trainDate !== null) {
            let date = moment(character.trainDate);
            let str = `En entraînement jusqu'à ${date.format('HH:mm:ss')}`;
            $container.find('.train-date').text(str);
        }
    },


    /**
     * Initialize le header du site
     */
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

        let callback = (e) => {
            let characterInfos = Addon.currentCharacter;

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

                    $parent.find('.centerTexte').eq(1).remove();
                }

                $this.createProgressBar($(this), 'experience', true, experienceCurrent, experienceMax);

                $(this).remove();
                $('[for="file"]').remove();
            });
        };

        Events.register(Events.CharacterLoaded, callback);
        Events.register(Events.ReloadInfosPersos, callback);
    },

    /**
     * Génère une barre de progression
     *
     * @param $parent
     * @param type
     * @param full
     * @param valueCurrent
     * @param valueMax
     */
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

        let $text = $(`<div class="text"><span class="current">${Utility.formatNumber(valueCurrent)}</span> / <span class="max">${Utility.formatNumber(valueMax)}</span></div>`)
            .appendTo($container);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.amber, 'Theme', ...args);
    },
};