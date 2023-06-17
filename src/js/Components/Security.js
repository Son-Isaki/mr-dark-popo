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
    ],

    init: function () {
        this.log('Initialized');

        this.canHaveAccess();
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
        return $('a[href^="/profilJoueur/"]')
            .attr('href')
            .replace('/profilJoueur/', '');
    },

    log: function (...args) {
        Logger.log(Logger.LOG.fg.black, 'Security', ...args);
    }
}