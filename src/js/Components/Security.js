const Security = window.Security = {
    hasAccess: false,

    init: function () {
        const $this = this;

        $this.canHaveAccess();
        $this.updateDebugMode();

        $this.log('Initialized');
    },

    updateDebugMode: function () {
        const $this = this;

        if (!$this.isUserLoggedIn) {
            Addon.debug = false;
        } else if (
            $this.getIdUser() !== 22 &&
            $this.getIdUser() !== 57
        ) {
            Addon.debug = false;
        } else {
            $this.log('You are an admin !');
        }
    },

    isUserLoggedIn: function () {
        return $('a[href="/logout"]').length > 0;
    },

    canHaveAccess: function () {
        const $this = this;

        if (!$this.isUserLoggedIn()) {
            return false;
        }

        let clanLink = $('a[href="/regarderClan/4"]');

        if (clanLink.length === 0)
            return false;

        if (clanLink.html() !== "Vulcain's Hammer")
            return false;

        this.hasAccess = true;
    },

    getIdUser: function () {
        return parseInt($('a[href^="/profilJoueur/"]')
            .attr('href')
            .replace('/profilJoueur/', '')
        );
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.brown, 'Security', ...args);
    }
}