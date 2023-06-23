const Automate = window.Automate = {
    characterCurrentPlanet: null,

    characterIndex: null,
    characterInterval: null,

    autoFightRunning: false,
    characterJustSwitched: false,

    OPTIONS: {
        safeZone: 'auto-fight-safe-zone',
        characterIndex: 'auto-fight-character-index',
        autoFightRunning: 'auto-fight-running',
        characterJustSwitched: 'auto-fight-character-switched',
        characterReadyToFight: 'auto-fight-character-ready',
    },

    init: function () {
        const $this = this;

        $this.log('Initialized');
    },

    changeCharacter: function() {
        const $this = this;

        let characterIndex = LocalStorage.get($this.OPTIONS.characterIndex, 'false');

        if (characterIndex === 'false') {
            Notify.notify('Un problème a eu lieu sur le changement de personnage.');
            return false;
        }

        let item = $(Addon.listCharactersHtml[characterIndex]);


        let $link = $(item).attr('href');
        $link = 'https://' + document.domain + $link;

        let $imgPlanet = $(item)
            .find('img')
            .eq(1)
            .attr('src');

        if ($imgPlanet === undefined) {
            $this.endAutoFight();
            return false;
        }

        if (!$this.charAvailable(item)) {
            $this.incrementCharacterIndex('reload');
            return false;
        }

        let urlFightZone = null;

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

        $.ajax({
            type: 'GET',
            url: $link,
            crossDomain: true,
        }).done( () => {
            $this.incrementCharacterIndex();
            LocalStorage.set($this.OPTIONS.characterJustSwitched, 'true');

            $this.moveToFightZone(item);
        });
    },

    putAllFavCharacterInTrain: function(type) {
        const $this = this;

        Addon.listCharactersHtml = $('nav.navbar li.dropdown')
            .eq(0)
            .find('div.dropdown-menu div.dropdown-menu')
            .find('a.dropdown-item')
            .clone(true);

        if (Addon.listCharactersHtml.length === 0) {
            Notify.notify('Aucun personnage favoris existant', 'danger');
            return false;
        }

        $this.loopCharTrain(type);
    },

    loopCharTrain: function (typeTrain) {
        const $this = this;

        let stopLoop = false;

        while (!stopLoop && Safezone.characterIndex < Object.keys(Addon.listCharactersHtml).length) {
            let item = $(Addon.listCharactersHtml[Safezone.characterIndex]);

            let $link = $(item).attr('href');
            let $linkChangeCharacter = 'https://' + document.domain + $link;

            if (!$this.charAvailable(item, typeTrain)) {
                stopLoop = true;
                Safezone.characterIndex++;
                return false;
            }

            let tmp = $(item).clone(true);

            let charName = $(tmp)
                .find('img')
                .each(function(key, item) {
                    $(item).remove();
                });

            charName = $(tmp)
                .html()
                .replaceAll(' ', '');

            Notify.notify('Changement du personnage vers '+charName);
            stopLoop = true;

            $.ajax({
                type: 'GET',
                url: $linkChangeCharacter,
                crossDomain: true,
            }).done( (response) => {
                if ($this.characterCurrentPlanet.indexOf('terre') === -1) {
                    $this.changePlanet($this.putCharInTrain, typeTrain)
                } else {
                    $this.putCharInTrain(typeTrain);
                }
            });

            Safezone.characterIndex++;
        }

        if (Safezone.characterIndex >= Object.keys(Addon.listCharactersHtml).length) {
            Safezone.terminateCharacterLoop('entraînement '+typeTrain);
        }
    },

    charAvailable: function (item, typeTrain = null) {
        const $this = this;

        let imgs = $(item).find('img');

        let $imgPlanet = imgs
            .eq(1)
            .attr('src');

        if ($imgPlanet === undefined) {
            Safezone.terminateCharacterLoop('entraînement '+typeTrain);
        }

        $this.characterCurrentPlanet = $imgPlanet;

        if ($this.checkIfCharIsDead($imgPlanet)) {
            Notify.notify('Le personnage est mort et ne peux pas s\'entraîner');
            return false;
        }

        if (imgs.length > 3) {
            Notify.notify('Le personnage est actuellement en entraînement');
            return false;
        }

        return true;
    },

    checkIfCharIsDead: function (imgPlanet) {
        const $this = this;

        if (imgPlanet.indexOf('parsif') !== -1) {
            return true;
        }

        return false;
    },

    changePlanet: function (callback, ...args) {
        const $this = this;

        let mapLink = 'https://www.jeuheros.fr/carte';

        Notify.notify('Changement de planète en cours');

        $.ajax({
            type: 'GET',
            url: mapLink,
            crossDomain: true,
        }).done( (response) => {
            let form = $(response).find('form');

            $.ajax({
                type: 'POST',
                url: mapLink,
                data: form.serialize(),
                crossDomain: true,
            }).done( () => {
                Notify.notify('Changement de planète terminé');
                if (callback) {
                    callback(args);
                }
            });
        });
    },

    moveToFightZone: function (...args) {
        const $this = this;

        let currentPlanetKey = null;
        if (args.length > 0) {
            currentPlanetKey = Utility.getPlanetCharacterFromList($(args[0]));
        } else {
            currentPlanetKey = Utility.getCurrentPlanetCurrentCharacter();
        }

        let fightZoneLink = Utility.urlFightZoneByPlanet[currentPlanetKey];

        $.ajax({
            type: 'GET',
            url: fightZoneLink,
            crossDomain: true,
        }).done(function () {
            LocalStorage.set($this.OPTIONS.characterJustSwitched, 'false');
            LocalStorage.set($this.OPTIONS.characterReadyToFight, 'true');
            Notify.notify('Le personnage a été déplacé en fight zone');
            window.location.href = 'https://' + document.domain + '/listeCombats';
        });
    },

    moveToSafeZone: function (...args) {
        const $this = this;

        let currentPlanetKey = Utility.getCurrentPlanetCurrentCharacter();
        let fightZoneLink = Utility.urlSafeZoneByPlanet[currentPlanetKey];

        $.ajax({
            type: 'GET',
            url: fightZoneLink,
            crossDomain: true,
        }).done(function () {
            Notify.notify('Le personnage a été déplacé en safe zone');
            if (args.length > 0) {
                Events.trigger(args[0]);
            }
        });
    },

    putCharInTrain: function (typeTrain) {
        const $this = this;

        let dataTrain = Utility.urlTrain[typeTrain];

        $.ajax({
            type: 'GET',
            url: dataTrain.map,
            crossDomain: true,
        }).done( () => {
            $.ajax({
                type: 'GET',
                url: dataTrain.action,
                crossDomain: true,
            }).done( () => {
                Notify.notify('Le personnage  a été envoyé en entraînement');
            })
        });
    },

    moveToShopEarth: function () {
        const $this = this;

        $.ajax({
            type: 'GET',
            url: 'https://' + document.domain + '/carte/move/44',
            crossDomain: true,
        }).done(function () {
            window.location.href = 'https://' + document.domain + '/magasinCapsules';
        });
    },

    moveToCapsMarket: function () {
        const $this = this;

        $.ajax({
            type: 'GET',
            url: 'https://www.jeuheros.fr/carte/move/38',
            crossDomain: true,
        }).done( () => {
            window.location.href = 'https://www.jeuheros.fr/magasin/venteCapsules';
        });
    },

    moveToObjMarket: function () {
        const $this = this;

        $.ajax({
            type: 'GET',
            url: 'https://www.jeuheros.fr/carte/move/38',
            crossDomain: true,
        }).done( () => {
            window.location.href = 'https://www.jeuheros.fr/magasin/venteObjets';
        });
    },

    healCharacter: function (amount = '5000') {
        const $this = this;

        $.ajax({
            type: 'GET',
            url: 'https://' + document.domain + '/soins',
            crossDomain: true,
        }).done( (response) => {
            let form = $(response).find('form[name="soins"]');
            Addon.log(form, form.serialize().replace('5000', amount));

            $.ajax({
                type: 'POST',
                url: 'https://' + document.domain + '/soins',
                data: form.serialize().replace('5000', amount),
                crossDomain: true,
                success:  () => {
                }
            })
        });
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.blue, 'Automate', ...args);
    },
}