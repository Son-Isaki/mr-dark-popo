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

        $this.log("Initialized");

    },

    /**
     * Bind les événements utiles à ce composant
     */
    bind: function () {
        const $this = this;

        Events.register(Events.ReloadInfosPersos, function () {
            // $this.initAvatars();
            // $this.initProgressBars();
        });

        Events.register(Events.CharacterLoaded, function () {
            // $this.initProgressBars();

            $this.initInfosPerso();
        });
    },

    /**
     * Remplace le HTML du bloc infos perso par une structure custom
     */
    replaceHtmlInfosPerso: function () {
        $(`
        <div class="infos-perso-container">
            <div class="infos-perso-row">
                <div class="infos-perso-avatar">
                    <a href="/perso/infoPersonnage">
                        <div class="character-avatar small">
                            <img class="background" src="" alt="">
                            <img class="effect" src="${Utility.getExtensionFilePath('dist/img/theme/avatar-effect.jpg')}" alt="">
                            <img class="avatar" src="" alt="">
                        </div>
                    </a>
                </div>
                <div class="infos-perso-infos">
                    <h3><span class="clan"></span><span class="name"></span></h3>
                    <p>Niveau <span class="level"></span></p>
                    
                    <div class="progressbar life">
                        <div class="background"></div>
                        <div class="value"></div>
                        <div class="text"><span class="current"></span>&nbsp;/&nbsp;<span class="max"></span></div>
                    </div>
                    <div class="progressbar experience">
                        <div class="background"></div>
                        <div class="value"></div>
                        <div class="text"><span class="current"></span>&nbsp;/&nbsp;<span class="max"></span></div>
                    </div>
                    <a href="/perso/infoPersonnage" class="link-action">Plus d'informations</a>
                </p>
            </div>
        </div>
        <table class="infos-perso-numbers">
            <tbody>
                <tr>
                    <td><img src="/img/zenis.png" alt=""></td>
                    <td><span>Monnaie</span></td>
                    <td class="zenis" id="zenisActuelJoueur"></td>
                </tr>
                <tr>
                    <td><img src="/img/OrbeRouge.png" alt=""></td>
                    <td><span>Energie d'attaque</span></td>
                    <td class="energy-atk"></td>
                </tr>
                <tr>
                    <td><img src="/img/OrbeBleu.png" alt=""></td>
                    <td><span>Energie de défense</span></td>
                    <td class="energy-def"></td>
                </tr>
                <tr>
                    <td><img src="/img/OrbeVerte.png" alt=""></td>
                    <td><span>Energie de magie</span></td>
                    <td class="energy-mag"></td>
                </tr>
                <tr>
                    <td><img src="/img/OrbeArgent.png" alt=""></td>
                    <td><span>Energie de précision</span></td>
                    <td class="energy-acc"></td>
                </tr>
                <tr>
                    <td><img src="/img/OrbeEx.png" alt=""></td>
                    <td><span>Energie extrême</span></td>
                    <td class="energy-ext"></td>
                </tr>

                </tbody>
            </table>
        `).insertAfter('.zone1sub');
        $('.zone1sub').remove();
    },

    /**
     * Initialize le bloc infos perso au chargement de la page
     */
    initInfosPerso: function () {
        const $this = this;

        $this.replaceHtmlInfosPerso();
        $this.displayInfosPerso(Addon.currentCharacter);
    },

    /**
     * Met à jour les informations du bloc infos perso
     */
    updateInfosPerso: function (content) {
        const $this = this;

        let character = new Character(content);
        Addon.currentCharacter = character = Avatar.AddCustomAvatarToCharacter(character)
        $this.displayInfosPerso(character);
    },

    /**
     * Inject les informations données dans le bloc infos perso
     */
    displayInfosPerso: function (data) {
        const $this = this;

        let $infosPerso = $('.infos-perso-container');

        $infosPerso.find('.clan').text(data.clanName);
        $infosPerso.find('.name').text(data.name);
        $infosPerso.find('.level').text(data.level);

        $infosPerso.find('.character-avatar .avatar, .character-avatar .background').attr('src', data.avatar);

        $infosPerso.find('.life .current').text(Utility.formatNumber(data.lifeCurrent));
        $infosPerso.find('.life .max').text(Utility.formatNumber(data.lifeMax));
        $infosPerso.find('.life .value').css('width', `${data.lifeCurrent / data.lifeMax * 100}%`);

        $infosPerso.find('.experience .current').text(Utility.formatNumber(data.experienceCurrent));
        $infosPerso.find('.experience .max').text(Utility.formatNumber(data.experienceMax));
        $infosPerso.find('.experience .value').css('width', `${data.experienceCurrent / data.experienceMax * 100}%`);

        $infosPerso.find('.zenis').text(Utility.formatNumber(data.zenis));
        $infosPerso.find('.energy-atk').text(Utility.formatNumber(data.energyAtk));
        $infosPerso.find('.energy-def').text(Utility.formatNumber(data.energyDef));
        $infosPerso.find('.energy-mag').text(Utility.formatNumber(data.energyMag));
        $infosPerso.find('.energy-acc').text(Utility.formatNumber(data.energyAcc));
        $infosPerso.find('.energy-ext').text(Utility.formatNumber(data.energyExt));
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