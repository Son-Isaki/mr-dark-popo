const CharacterListPage = window.CharacterListPage = {

    init: function () {
        const $this = this;

        $this.bind();

        $('button[data-type="all"]').trigger('click');

        $('.cadrePersoList2').removeClass('cadrePersoList2');

        $('.zoneCapsulesEquipe5 > p:last-child')
            .prependTo($('.zoneCapsulesEquipe5'));

        $this.log("Initialized");
    },

    bind: function () {
        const $this = this;

        Events.register(Events.LevelsLoaded, () => {
            if (LocalStorage.get(Options.OPTIONS.customThemeEnabled, 'false') === 'true') {
                $this.initTheme();
            }
        });
    },

    initTheme: function () {
        const $this = this;

        $('.cadrePersoList br').remove();

        $('.flexCharacterList')
            .removeClass('flexCharacterList couleurBlack')
            .addClass('character-list');

        $('#dragonballPersos, #narutoPersos, #onepiecePersos, #bleachPersos, #CCSXSMPersos, #autrePersos')
            .addClass('section-transparent');

        $('.cadrePersoList').each(async function () {
            let $item = $(this);

            let character = new Character($item[0].outerHTML);
            Avatar.AddCustomAvatarToCharacter(character)

            let html = await Utility.getExtensionFileAsHtml('dist/html/character-list-item.html');
            let $container = $(html);

            $container.appendTo($item.parent());
            Theme.injectCharacterData($container, character);

            $item.remove();
        });
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeppurple, 'CharacterListPage', ...args);
    },

};