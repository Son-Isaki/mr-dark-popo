const Automate = window.Automate = {
    characterCurrentPlanet: null,

    init: function () {
        const $this = this;

        $this.log('Initialized');
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
                if (Automate.characterCurrentPlanet.indexOf('terre') === -1) {
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

    charAvailable: function (item, typeTrain) {
        const $this = this;

        let imgs = $(item).find('img');

        let $imgPlanet = imgs
            .eq(1)
            .attr('src');

        if ($imgPlanet === undefined) {
            Safezone.terminateCharacterLoop('entraînement '+typeTrain);
        }

        Automate.characterCurrentPlanet = $imgPlanet;

        if ($this.checkIfCharIsDead($imgPlanet)) {
            Notify.notify('Le personnage est mort et ne peux pas s\'entraîner');
            return false;
        }

        if (imgs.length > 3) {
            Notify.notify('Le personnage est déjà en entraînement');
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

    changePlanet: function (callback, typeTrain) {
        const $this = this;

        let mapLink = 'https://www.jeuheros.fr/carte';

        // if (typeof callback === 'function') {
        //     callback(typeTrain);
        // }

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
                Notify.notify('Changement de planète terminer');
                callback(typeTrain);
            });
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
                Notify.notify('Le personnage a été envoyé en entraînement');
            })
        });
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.blue, 'Automate', ...args);
    },
}