const Avatar = window.Avatar = {
    STORAGE: 'custom-avatar-data',

    init: function() {
        const $this = this;

        $this.bind();
    },

    bind: function () {
        const $this = this;

        Events.register(Events.CharacterLoaded, function () {
            $this.changeCurrentCharacterAvatar();
        });

        Events.register(Events.ReloadInfosPersos, function () {
            $this.changeCurrentCharacterAvatar();
        });
    },

    changeCurrentCharacterAvatar: function () {
        const $this = this;

        if (LocalStorage.get(Options.OPTIONS.customAvatar, 'false') === 'false') {
            return false;
        }

        let allAvatar = LocalStorage.get($this.STORAGE, 'false');

        if (allAvatar === 'false') {
            return false;
        }

        allAvatar = JSON.parse(allAvatar);

        if (allAvatar[Addon.characterInfos.slug] === undefined) {
            return false;
        }

        let avatar = allAvatar[Addon.characterInfos.slug].avatar;
        let thumbnail = allAvatar[Addon.characterInfos.slug].thumbnail;

        if (avatar !== null && thumbnail !== null) {
            let slug = Addon.characterInfos.slug;
            let name = Addon.characterInfos.name;

            let avatarFullPath = Utility.getExtensionFilePath(avatar);
            let thumbFullPath = Utility.getExtensionFilePath(thumbnail);

            let avatarChanged = false;
            let limitChar = 5;
            while (!avatarChanged) {
                let shortSlug = slug.slice(0, limitChar);
                let shortName = name.slice(0, limitChar);

                let $imgZone1AvatarName = $('.zone1 img.avatar[src*="'+name+'"]');
                let $imgZone1AvatarShortName = $('.zone1 img.avatar[src*="'+shortName+'"]');
                let $imgZone1AvatarSlug = $('.zone1 img.avatar[src*="'+slug+'"]');
                let $imgZone1AvatarShortSlug = $('.zone1 img.avatar[src*="'+shortSlug+'"]');
                let $imgZone1BackgroundName = $('.zone1 img.background[src*="'+name+'"]');
                let $imgZone1BackgroundShortName = $('.zone1 img.background[src*="'+shortName+'"]');
                let $imgZone1BackgroundSlug = $('.zone1 img.background[src*="'+slug+'"]');
                let $imgZone1BackgroundShortSlug = $('.zone1 img.background[src*="'+shortSlug+'"]');

                let $imgInfoPersoAvatarName = $('.infoPerso img.avatar[src*="'+name+'"]');
                let $imgInfoPersoAvatarShortName = $('.infoPerso img.avatar[src*="'+shortName+'"]');
                let $imgInfoPersoAvatarSlug = $('.infoPerso img.avatar[src*="'+slug+'"]');
                let $imgInfoPersoAvatarShortSlug = $('.infoPerso img.avatar[src*="'+shortSlug+'"]');
                let $imgInfoPersoBackgroundName = $('.infoPerso img.background[src*="'+name+'"]');
                let $imgInfoPersoBackgroundShortName = $('.infoPerso img.background[src*="'+shortName+'"]');
                let $imgInfoPersoBackgroundSlug = $('.infoPerso img.background[src*="'+slug+'"]');
                let $imgInfoPersoBackgroundShortSlug = $('.infoPerso img.background[src*="'+shortSlug+'"]');

                if ($imgZone1AvatarShortSlug.length > 0 ||
                    $imgZone1AvatarShortName.length > 0 ||
                    $imgInfoPersoAvatarShortName.length > 0 ||
                    $imgInfoPersoAvatarShortSlug.length > 0
                ) {
                    $imgZone1AvatarName.attr('src', thumbFullPath);
                    $imgZone1AvatarShortName.attr('src', thumbFullPath);
                    $imgZone1AvatarSlug.attr('src', thumbFullPath);
                    $imgZone1AvatarShortSlug.attr('src', thumbFullPath);
                    $imgZone1BackgroundName.attr('src', thumbFullPath);
                    $imgZone1BackgroundShortName.attr('src', thumbFullPath);
                    $imgZone1BackgroundSlug.attr('src', thumbFullPath);
                    $imgZone1BackgroundShortSlug.attr('src', thumbFullPath);
                    $imgInfoPersoAvatarName.attr('src', avatarFullPath);
                    $imgInfoPersoAvatarShortName.attr('src', avatarFullPath);
                    $imgInfoPersoAvatarSlug.attr('src', avatarFullPath);
                    $imgInfoPersoAvatarShortSlug.attr('src', avatarFullPath);
                    $imgInfoPersoBackgroundName.attr('src', avatarFullPath);
                    $imgInfoPersoBackgroundShortName.attr('src', avatarFullPath);
                    $imgInfoPersoBackgroundSlug.attr('src', avatarFullPath);
                    $imgInfoPersoBackgroundShortSlug.attr('src', avatarFullPath);

                    avatarChanged = true;
                }
                limitChar--;
            }
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeporange, 'Avatar', ...args);
    },
}