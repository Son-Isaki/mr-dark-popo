const CharacterPage = window.Character = {

    ENDPOINT: {
        findBy: '/avatars',
    },

    LIST_AVATAR: {
        'chichi': [
            'dist/img/avatar/chichi/Chichi_1.png',
            'dist/img/avatar/chichi/Chichi_2.png',
        ],
    },

    init: function() {
        const $this = this;

        $this.bind();
    },

    bind: function () {
        const $this = this;

        Events.register(Events.CharacterLoaded, function () {
            $this.addMoreAvatar();
        });
    },

    addMoreAvatar: function () {
        const $this = this;

        if (LocalStorage.get(Options.OPTIONS.customAvatar, 'false') === 'false') {
            return false;
        }

        $.ajax({
            type: 'GET',
            url: Database.domain+$this.ENDPOINT.findBy,
            data: {
                slug: Addon.characterInfos.slug
            },
            dataType: 'json',
            crossDomain: true,
        }).done((response) => {
            if (response.response.length === 0) {
                return false;
            }

            let base64Prefix = 'data:image/png;base64,';

            let $containerAvatar = $('.zoneFlexAvatarSwitch');

            $.each(response.response, (key, avatar) => {

                switch (avatar.type) {
                    default:
                        break;
                }

                let $fullPath = base64Prefix+avatar.path;
                let $fullPathThumb = base64Prefix+avatar.mini;
                $('<a class="icon_add" href="#"><img class="tailleImgAvatarChange listeChoixAvatarDecalage" src="'+$fullPath+'" alt="ImageAvatar"></a>')
                    .on('click', () => {
                        LocalStorage.set(Addon.characterInfos.slug+'-custom-avatar', $fullPath);
                        LocalStorage.set(Addon.characterInfos.slug+'-custom-avatar-thumb', $fullPathThumb);
                        location.reload();
                    }).appendTo($containerAvatar);
            });
        });

        let currentAvatar = LocalStorage.get(Addon.characterInfos.slug+'-custom-avatar', 'false');

        if (currentAvatar !== 'false') {
            $('<button class="btn btn-danger" type="button">Retirer l\'avatar custom</button>')
                .on('click', (e) => {
                    e.preventDefault();
                    LocalStorage.set(Addon.characterInfos.slug+'-custom-avatar', 'false');
                    LocalStorage.set(Addon.characterInfos.slug+'-custom-avatar-thumb', 'false');
                    location.reload();
                })
                .appendTo('.zoneBoutonDrop p');
        }

    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeppurple, 'CharacterPage', ...args);
    },
}