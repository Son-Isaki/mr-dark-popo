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
                slug: Addon.currentCharacter.slug
            },
            dataType: 'json',
            crossDomain: true,
        }).done((response) => {
            if (response.response.length === 0) {
                return false;
            }

            let basePath = 'dist/img/custom_avatar_webp/';

            let $containerAvatar = $('.zoneFlexAvatarSwitch');

            $.each(response.response, (key, avatar) => {

                let $path = basePath+avatar.path;
                let $thumbPath = basePath+avatar.mini;
                let customId = 'custom-avatar-'+avatar.id;

                switch (avatar.type) {
                    default:
                        $('<a class="icon_add" href="#"><img class="tailleImgAvatarChange listeChoixAvatarDecalage" id="'+customId+'" src="'+Utility.getExtensionFilePath($path)+'" alt="ImageAvatar"></a>')
                            .on('click', () => {
                                $this.addCustomAvatarOnStorage($path, $thumbPath);
                            }).appendTo($containerAvatar);
                        break;

                    case "replace":
                        let original = avatar.original;

                        if (original) {
                            let $originalImage = $('img[src="'+original+'"]');

                            $originalImage.attr('src', Utility.getExtensionFilePath($path))
                                .parent()
                                .attr('href', '#')
                                .on('click', () => {
                                    $this.addCustomAvatarOnStorage($path, $thumbPath);
                                });
                        }
                        break;
                }
            });
        });

        let currentAvatar = LocalStorage.get(Addon.currentCharacter.slug+'-custom-avatar', 'false');

        if (currentAvatar !== 'false') {
            $('<button class="btn btn-danger" type="button">Retirer l\'avatar custom</button>')
                .on('click', (e) => {
                    e.preventDefault();
                    LocalStorage.set(Addon.currentCharacter.slug+'-custom-avatar', 'false');
                    LocalStorage.set(Addon.currentCharacter.slug+'-custom-avatar-thumb', 'false');
                    location.reload();
                })
                .appendTo('.zoneBoutonDrop p');
        }

    },

    addCustomAvatarOnStorage: function($path, $thumbPath) {
        const $this = this;

        let allAvatarStored = LocalStorage.get(Avatar.STORAGE, 'false');

        if (allAvatarStored === 'false') {
            allAvatarStored = {};
            allAvatarStored[Addon.currentCharacter.slug] = {
                avatar: $path,
                thumbnail: $thumbPath,
            };
        }

        if (typeof allAvatarStored !== "object") {
            allAvatarStored = JSON.parse(allAvatarStored);
            allAvatarStored[Addon.currentCharacter.slug] = {
                avatar: $path,
                thumbnail: $thumbPath,
            };
        }

        LocalStorage.set(Avatar.STORAGE, JSON.stringify(allAvatarStored));
        location.reload();
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeppurple, 'CharacterPage', ...args);
    },
}