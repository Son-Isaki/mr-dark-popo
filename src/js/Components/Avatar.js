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
    },

    changeCurrentCharacterAvatar: function () {
        const $this = this;

        if (LocalStorage.get(Options.OPTIONS.customAvatar, 'false') === 'false') {
            return false;
        }

        let avatar = LocalStorage.get(Addon.characterInfos.slug+'-custom-avatar', 'false');

        $this.log('try to get avatar', Addon.characterInfos.slug+'-custom-avatar', avatar)
        if (avatar !== 'false') {
            $('img.avatar').attr('src', avatar);
            $('img.background').attr('src', avatar);
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeporange, 'Avatar', ...args);
    },
}