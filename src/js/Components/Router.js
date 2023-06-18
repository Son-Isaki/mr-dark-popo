const Router = window.Router = {

    // variables
    ROUTES: [
        {
            name: "Personnages",
            path: '/perso/listePersonnage',
            callback: CharacterListPage,
        },
        {
            name: "Inventaire",
            path: '/inventaire',
            callback: InventoryPage,
        },
        // {
        //     name: "Profil",
        //     path: '/profilJoueur',
        //     callback: 'initProfilPage',
        // },
    ],

    init: function () {
        const $this = this;

        $this.handle();

        $this.log("Initialized");

    },

    handle: function () {
        const $this = this;

        for (let i = 0; i < $this.ROUTES.length; i++) {
            let route = $this.ROUTES[i];
            if (Addon.checkUrl(route.path)) {
                route.callback.init();
                $this.log(`Route initialized : ${route.name} (${route.callback})`);
            }
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.pink, 'Router', ...args);
    },

};