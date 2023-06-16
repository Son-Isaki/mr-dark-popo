const Safezone = window.FightsComponent = {

    // variables
    selectedLife: 100000,
    selectedRatio: 1,
    selectedLevel: 0,

    fightIndex: 0,
    fightInterval: null,

    init: function () {
        const $this = this;

        if ($this.debug) $this.log('Debug mode is active');

        // $this.bind();

    },

    putAllCharInSafeZone: function () {
        console.log(addOn.listCharactersHtml);

        $.each(addOn.listCharactersHtml, function (key, item) {
            let $link = $(item).attr('href');
            $link = 'https://' + document.domain + $link;

            $.ajax({
                type: 'GET',
                url: $link,
                crossDomain: true,
            }).done(function (response) {
                console.log(response);
            });

            return false;
        });
    },

    putAllCharInFightZone: function () {

    },

    log: function (...args) {
        Logger.log(Logger.LOG.fg.red, 'Fights', ...args);
    },

}