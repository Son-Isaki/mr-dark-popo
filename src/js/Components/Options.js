const Options = window.Options = {

    // variables
    OPTIONS: {
        displayTimerRefreshLife: 'addon-display-timer-refresh-life',
        customThemeEnabled: 'custom-theme-enabled',

        showSafezoneInActions: 'show-safezone-actions',
        showShopInActions: 'show-shop-actions',
        showHealInActions: 'show-heal-actions',
        showFightTourInActions: 'show-fight-tour-actions',
        showFightZoneInActions: 'show-fight-zone-actions',
        showTrainsInActions: 'show-trains-actions',
    },

    init: function() {
        this.displayOptionsPage();

        this.log('Initialized');
    },

    displayOptionsPage: function() {
        this.log('displayOptionsPage loaded', Addon.currentUrl, document.URL);
        if (!Addon.checkUrl('/?addOn')) {
            return false;
        }

        let $characterContainer = $('#zoneDuPersonnage');
        $characterContainer.remove();


        let $container = $('#zoneBoss2');
        $container.html('');

        let $title = $('<h2>Gestion des options de l\'Addon</h2>');
        $container.append($title);

        this.log(Utility.safeZoneByPlanet);
        this.showOptions();
    },

    showOptions: function() {
        $(this.OPTIONS).each(function(id, option) {

        });
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.blue, 'Options', ...args);
    },
}