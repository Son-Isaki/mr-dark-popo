$('document').ready(function () {

    Security.init();
    if (!Security.hasAccess) {
        return false;
    }

    Logger.init();
    Database.init();
    Addon.init();
    Options.init();
    Router.init();
    Theme.init();
    Notify.init();
    Fights.init();
    Safezone.init();
    Avatar.init();
    Automate.init();
})
