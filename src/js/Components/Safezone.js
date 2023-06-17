const Safezone = window.FightsComponent = {

    // variables
    selectedLife: 100000,
    selectedRatio: 1,
    selectedLevel: 0,

    fightIndex: 0,
    fightInterval: null,

    characterIndex: 0,
    characterInterval: null,
    treatmentCharacterRunning: false,

    init: function () {
        const $this = this;

        $this.log("Initialized");
    },

    putAllCharInSafeZone: function () {
        Addon.listCharactersHtml = $('nav.navbar li.dropdown')
            .eq(0)
            .find('div.dropdown-menu div.dropdown-menu')
            .find('a.dropdown-item')
            .clone(true);

        if (Addon.listCharactersHtml.length === 0) {
            Notify.notify('Aucun personnage favoris existant', 'danger');
            return false;
        }

        Safezone.log(Addon.listCharactersHtml);

        let stopLoop = false;

        while (!stopLoop && Safezone.characterIndex < Object.keys(Addon.listCharactersHtml).length) {
            let item = $(Addon.listCharactersHtml[Safezone.characterIndex]);

            let $link = $(item).attr('href');
            $link = 'https://' + document.domain + $link;

            let $imgPlanet = $(item)
                .find('img')
                .eq(1)
                .attr('src');

            if ($imgPlanet === undefined) {
                Safezone.terminateCharacterLoop('safe zone');
            }

            let urlSafeZone = null;

            // On récupère le lien/la case de safe zone correspondant à la planète
            $.each(Utility.urlSafeZoneByPlanet, function (key, linkPlanet) {
                let index = $imgPlanet.indexOf(key);
                Safezone.log('find planet', key, linkPlanet, index);

                if (index !== -1 && urlSafeZone === null) {
                    urlSafeZone = linkPlanet;
                }
            });

            let isOnSafeZone = $(item)
                .find('img')
                .eq(2)
                .attr('src').indexOf('safezone');

            let tmp = $(item).clone(true);

            let charName = $(tmp)
                .find('img')
                .each(function(key, item) {
                    $(item).remove();
                });

            charName = $(tmp)
                .html()
                .replaceAll(' ', '');
            // Si le personnage n'est pas safe zone on le traite
            if (isOnSafeZone === -1) {

                Notify.notify('Changement du personnage vers '+charName);
                Safezone.log('Planete case zone', urlSafeZone);

                stopLoop = true;

                $.ajax({
                    type: 'GET',
                    url: $link,
                    crossDomain: true,
                }).done( (response) => {
                    $.ajax({
                        type: 'GET',
                        url: urlSafeZone,
                        crossDomain: true,
                    }).done(() => {
                        Notify.notify('Le personnage '+charName+' a été mis en safe zone', 'success');
                    });

                    Safezone.log(response);
                });
            } else {
                Notify.notify('Le personnage '+charName+' est déjà en safe zone');
            }

            Safezone.characterIndex++;
        }

        if (Safezone.characterIndex >= Object.keys(Addon.listCharactersHtml).length) {
            Safezone.terminateCharacterLoop('safe zone');
        }
    },

    putAllCharInFightZone: function () {
        Addon.listCharactersHtml = $('nav.navbar li.dropdown')
            .eq(0)
            .find('div.dropdown-menu div.dropdown-menu')
            .find('a.dropdown-item')
            .clone(true);

        if (Addon.listCharactersHtml.length === 0) {
            Notify.notify('Aucun personnage favoris existant', 'danger');
            return false;
        }

        Safezone.log(Addon.listCharactersHtml);

        let stopLoop = false;

        while (!stopLoop && Safezone.characterIndex < Object.keys(Addon.listCharactersHtml).length) {
            let item = $(Addon.listCharactersHtml[Safezone.characterIndex]);

            let $link = $(item).attr('href');
            $link = 'https://' + document.domain + $link;

            let $imgPlanet = $(item)
                .find('img')
                .eq(1)
                .attr('src');

            if ($imgPlanet === undefined) {
                Safezone.terminateCharacterLoop('fight zone');
            }

            let urlFightZone = null;

            // On récupère le lien/la case de safe zone correspondant à la planète
            $.each(Utility.urlFightZoneByPlanet, function (key, linkPlanet) {
                let index = $imgPlanet.indexOf(key);
                Safezone.log('find planet', key, linkPlanet, index);

                if (index !== -1 && urlFightZone === null) {
                    urlFightZone = linkPlanet;
                }
            });

            let isOnFightZone = $(item)
                .find('img')
                .eq(2)
                .attr('src').indexOf('fighting');

            let tmp = $(item).clone(true);

            let charName = $(tmp)
                .find('img')
                .each(function(key, item) {
                    $(item).remove();
                });

            charName = $(tmp)
                .html()
                .replaceAll(' ', '');
            // Si le personnage n'est pas safe zone on le traite
            if (isOnFightZone === -1) {

                Notify.notify('Changement du personnage vers '+charName);
                Safezone.log('Planete fight zone', urlFightZone);

                stopLoop = true;

                $.ajax({
                    type: 'GET',
                    url: $link,
                    crossDomain: true,
                }).done( (response) => {
                    $.ajax({
                        type: 'GET',
                        url: urlFightZone,
                        crossDomain: true,
                    }).done(() => {
                        Notify.notify('Le personnage '+charName+' a été mis en fight zone', 'success');
                    });

                    Safezone.log(response);
                });
            } else {
                Notify.notify('Le personnage '+charName+' est déjà en fight zone');
            }

            Safezone.characterIndex++;
        }

        if (Safezone.characterIndex >= Object.keys(Addon.listCharactersHtml).length) {
            Safezone.terminateCharacterLoop('fight zone');
        }
    },

    terminateCharacterLoop: function (type) {
        if (Safezone.characterInterval !== null) {
            Notify.notify('Déplacement des personnages favoris en '+type+' terminé', 'success');
            clearInterval(Safezone.characterInterval);
            Safezone.characterInterval = null;
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.green, 'Safezone', ...args);
    },

}