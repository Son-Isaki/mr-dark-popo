const CharacterListPage = window.CharacterListPage = {

    init: function () {
        const $this = this;

        $('button[data-type="all"]').trigger('click');

        $('.cadrePersoList2').removeClass('cadrePersoList2');

        $('.zoneCapsulesEquipe5 > p:last-child')
            .prependTo($('.zoneCapsulesEquipe5'));

        Database.updateLevels();

        $this.log("Initialized");

    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeppurple, 'CharacterListPage', ...args);
    },

};