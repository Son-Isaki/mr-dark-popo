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
        if (avatar !== 'false') {
            let slug = Addon.characterInfos.slug;
            let name = Addon.characterInfos.name;
            let shortSlug = slug.slice(0,5);
            let shortName = name.slice(0,5);

            $('.zone1 img.avatar[src*="'+shortName+'"]').attr('src', avatar);
            $('.zone1 img.avatar[src*="'+shortSlug+'"]').attr('src', avatar);
            $('.zone1 img.background[src*="'+shortName+'"]').attr('src', avatar);
            $('.zone1 img.background[src*="'+shortSlug+'"]').attr('src', avatar);

            $('.infoPerso img.avatar[src*="'+shortSlug+'"]').attr('src', avatar);
            $('.infoPerso img.avatar[src*="'+shortName+'"]').attr('src', avatar);
            $('.infoPerso img.background[src*="'+shortSlug+'"]').attr('src', avatar);
            $('.infoPerso img.background[src*="'+shortName+'"]').attr('src', avatar);
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeporange, 'Avatar', ...args);
    },
}