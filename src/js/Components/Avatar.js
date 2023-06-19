const Avatar = window.Avatar = {
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

        let avatar = LocalStorage.get(Addon.characterInfos.slug+'-custom-avatar', 'false');
        let thumbnail = LocalStorage.get(Addon.characterInfos.slug+'-custom-avatar-thumb', false);
        if (avatar !== 'false' && thumbnail !== 'false') {
            let slug = Addon.characterInfos.slug;
            let name = Addon.characterInfos.name;

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
                    $imgZone1AvatarName.attr('src', thumbnail);
                    $imgZone1AvatarShortName.attr('src', thumbnail);
                    $imgZone1AvatarSlug.attr('src', thumbnail);
                    $imgZone1AvatarShortSlug.attr('src', thumbnail);
                    $imgZone1BackgroundName.attr('src', thumbnail);
                    $imgZone1BackgroundShortName.attr('src', thumbnail);
                    $imgZone1BackgroundSlug.attr('src', thumbnail);
                    $imgZone1BackgroundShortSlug.attr('src', thumbnail);
                    $imgInfoPersoAvatarName.attr('src', avatar);
                    $imgInfoPersoAvatarShortName.attr('src', avatar);
                    $imgInfoPersoAvatarSlug.attr('src', avatar);
                    $imgInfoPersoAvatarShortSlug.attr('src', avatar);
                    $imgInfoPersoBackgroundName.attr('src', avatar);
                    $imgInfoPersoBackgroundShortName.attr('src', avatar);
                    $imgInfoPersoBackgroundSlug.attr('src', avatar);
                    $imgInfoPersoBackgroundShortSlug.attr('src', avatar);

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