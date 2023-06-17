$('document').ready(function () {
    Security.init();

    if (!Security.hasAccess) {
        return false;
    }

    Addon.init();
    Notify.init();
    Fights.init();
    Safezone.init();
    Options.init();
})
