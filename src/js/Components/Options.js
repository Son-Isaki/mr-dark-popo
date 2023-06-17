const Options = window.options = {

    options: [
        'addon_display_timer_refresh_life',
    ],

    init: function() {
        this.displayOptionsPage();

        this.log('Options init');
    },

    displayOptionsPage: function() {
        this.log('displayOptionsPage loaded', Addon.currentUrl, document.URL);
        if (!Addon.checkUrl('https://www.jeuheros.fr/?addOn')) {
            return false;
        }

        let $characterContainer = $('#zoneDuPersonnage');
        $characterContainer.remove();


        let $container = $('#zoneBoss2');
        $container.html('');

        let $title = $('<h2>Gestion des options de l\'Addon</h2>');
        $container.append($title);


        this.showOptions();
    },

    showOptions: function() {
        $(this.options).each(function(id, option) {

        });
    },

    log: function (...args) {
        Logger.log(Logger.LOG.fg.blue, 'Options', ...args);
    },
}