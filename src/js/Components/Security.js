const Security = window.Security = {
    hasAccess: false,
    whiteList: [
        14, // Excasis
        6, // Laman
        5, // Ice.Thales
        12, // Konoshi
        84, // VaLyon
        21, // Regulus
        41, // BloodChopper
        24, // Apollo
        22, // Testeur Officiel
        4, // Daiki
        25, // PolonaisDeter
        46, // Vaqui
        33, // SuperBro
        15, // ninik
        13, // BigSmileIci
        91, // KyanBrand
        82, // Carbonic
        49, // Nonomimi
        10, // TensaZangetsu
        60, // wolf
        216, // kiranoma
        590, // Sg4_tv
        57, // Rominov
        435, // Shoriu
        68, // Natsuro
        52, // BdX_D
        89, // Yoohyeon
        655, // Ragusen
        669, // Kono
        637, // Luxuko
        644, // NOUNOURS
        678, // °MR°Mystogan
        679, // 404 not found (sg4)
    ],

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

        let idUser = parseInt(this.getIdUser());

        if (this.whiteList.indexOf(idUser) === '-1') {
            return false;
        }

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