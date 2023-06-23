const Fights = window.FightsComponent = {

    // variables
    defaultLife: 60000,
    defaultRatio: 1,
    defaultLevel: 0,

    selectedLife: this.defaultLife,
    selectedRatio: this.defaultRatio,
    selectedLevel: this.defaultLevel,

    moveToSafezoneAfter: false,

    fightIndex: 0,
    fightInterval: null,

    counterFightList: 0,

    init: function () {
        const $this = this;

        $this.bind();
        $this.ajaxFight();

        $this.log('Initialized');
    },

    bind: function () {
        const $this = this;

        Events.register(Events.CharacterLoaded, function () {
            $this.addAutoFightFormToView();
        });
    },

    addAutoFightFormToView: function () {
        if (LocalStorage.get(Options.OPTIONS.autoFightForm, 'false') === 'false') {
            return false;
        }

        const $this = this;

        if (!Addon.checkUrl('/listeCombats')) {
            return false;
        }

        let $section = $(
            '<section id="zoneBoss2">' +
            '<h2>Combats automatiques</h2>' +
            '</section>'
        ).prependTo($('.zone2'));

        let $table = $(
            '<table class="table">'
        ).appendTo($section);

        let $firstRow = $(
            '<tr>'
        ).appendTo($table);

        let $secondRow = $(
            '<tr>'
        ).appendTo($table);

        // LIFE

        $('<td><label for="limitLifeInput" title="Stop automatiquement les combats lorsque la vie atteint le montant">Vie max</label></td>')
            .appendTo($firstRow);

        $this.selectedLife = parseInt(LocalStorage.get(`${Addon.currentCharacter.slug}-life`));
        if (typeof $this.selectedLife === 'undefined' || isNaN($this.selectedLife))
            $this.selectedLife = $this.defaultLife;
        $(`<td><input type="number" min="${this.defaultLife}" step="10000" class="form-control" name="limitLifeInput" id="limitLifeInput" value="${$this.selectedLife}"/></td>`)
            .appendTo($secondRow)
            .on('change', function () {
                $this.selectedLife = parseInt($(this).find('input').val());
                LocalStorage.set(`${Addon.currentCharacter.slug}-life`, $this.selectedLife)
            })

        // RATIO

        $('<td><label for="ratioInput" title="Evite les combats contre des héros dont le ratio est supérieur au montant">Ratio max</label></td>')
            .appendTo($firstRow);

        $this.selectedRatio = parseFloat(LocalStorage.get(`${Addon.currentCharacter.slug}-ratio`));
        if (typeof $this.selectedRatio === 'undefined' || isNaN($this.selectedRatio))
            $this.selectedRatio = $this.defaultRatio;
        $(`<td><input type="number" min="0" step="0.1" class="form-control" name="ratioInput" id="ratioInput" value="${$this.selectedRatio}"/></td>`)
            .appendTo($secondRow)
            .on('change', function () {
                $this.selectedRatio = parseFloat($(this).find('input').val());
                LocalStorage.set(`${Addon.currentCharacter.slug}-ratio`, $this.selectedRatio)
            })

        // LEVEL

        $('<td><label for="levelInput" title="Evite les combats contre des héros dont la différence de niveau est supérieur au montant">Niveau max <span style="font-size:.7em;">(différence)</span></label></td>')
            .appendTo($firstRow);

        $this.selectedLevel = parseFloat(LocalStorage.get(`${Addon.currentCharacter.slug}-level`));
        if (typeof $this.selectedLevel === 'undefined' || isNaN($this.selectedLevel))
            $this.selectedLevel = $this.defaultLevel;
        $(`<td><input type="number" min="0" step="1" class="form-control" name="levelInput" id="levelInput" value="${$this.selectedLevel}"/></td>`)
            .appendTo($secondRow)
            .on('change', function () {
                $this.selectedLevel = parseFloat($(this).find('input').val());
                LocalStorage.set(`${Addon.currentCharacter.slug}-level`, $this.selectedLevel)
            })

        // BOUTON SAFEZONE

        $('<td><label for="goToSafeZone" class="m-0" title="Déplace le héro en safezone après le combat">Safe zone</label></td>')
            .appendTo($firstRow);

        $this.moveToSafezoneAfter = LocalStorage.get(`${Addon.currentCharacter.slug}-safezone`) === 'true';
        if (typeof $this.moveToSafezoneAfter === 'undefined')
            $this.moveToSafezoneAfter = false;

        $(`<td><input type="checkbox" name="goToSafeZone" id="goToSafeZone" class="ml-1" ${$this.moveToSafezoneAfter ? "checked=\"checked\"" : ""} /></td>`)
            .appendTo($secondRow)
            .find('input')
            .on('change', function () {
                $this.moveToSafezoneAfter = $('#goToSafeZone').prop('checked');
                LocalStorage.set(`${Addon.currentCharacter.slug}-safezone`, $this.moveToSafezoneAfter)
            });

        // Special Konoshi le flemmard
        // if (!$('#goToSafeZone').prop('checked')) {
        //     $('#goToSafeZone').trigger('click');
        // }

        // BUTTON LANCER LES COMBATS

        $('<td><button type="button" class="btn btn-primary">Lancer les combats</button></td>')
            .appendTo($firstRow)
            .on('click', function () {
                if ($this.fightInterval !== null) {
                    return false;
                }

                $this.fightIndex = 0;
                $this.fightInterval = setInterval(() => {
                    $this.fightLoop();
                }, 1000);
            });

        $('<td><button type="button" class="btn btn-dark">Stopper</button></td>')
            .appendTo($secondRow)
            .on('click', function () {
                $this.terminateFightLoop($this.moveToSafezoneAfter);
            })
    },

    fightLoop: function () {
        const $this = this;

        let stopLoop = false;

        while (!stopLoop && $this.fightIndex < Object.keys(Addon.listFighters).length) {
            let $fighter = $(Addon.listFighters[$this.fightIndex]);
            delete Addon.listFightersTmp[$this.fightIndex];

            let fightLabel = Utility.trim($fighter.find('td').eq(0).text());

            // life
            let isLifeSafe = Addon.currentCharacter.lifeCurrent > $this.selectedLife;

            // ratio
            let fightStats = $fighter.find('td').eq(2).text().split('/');
            let fightRatio = (parseInt(fightStats[0]) + parseInt(fightStats[2])) / (parseInt(fightStats[1]));
            let isRatioSafe = fightRatio <= $this.selectedRatio;

            // level
            let fightLevel = parseInt($fighter.find('td').eq(1).text());
            let isLevelSafe = fightLevel - Addon.currentCharacter.level <= $this.selectedLevel;

            if (fightLevel < Addon.currentCharacter.level) {
                $this.terminateFightLoop($this.moveToSafezoneAfter);
                return false;
            }

            if (isLifeSafe && isRatioSafe && isLevelSafe) {

                // send fight
                $fighter.find('.newfight')
                    .removeClass('btn-dark')
                    .addClass('btn-secondary')
                    .trigger('click');

                stopLoop = true;

            } else if (!isLifeSafe) {

                // plus assez de vie, fin des combats
                $this.terminateFightLoop($this.moveToSafezoneAfter);
                stopLoop = true;

            } else {

                // mark fight as dangerous
                $fighter.find('.newfight')
                    .removeClass('btn-secondary')
                    .addClass('btn-dark')

            }

            $this.fightIndex++;
        }

        if ($this.fightIndex >= Object.keys(Addon.listFighters).length) {
            $this.terminateFightLoop($this.moveToSafezoneAfter);
        }
    },

    terminateFightLoop: function (moveToSafeZone) {
        const $this = this;

        if ($this.fightInterval !== null) {
            clearTimeout($this.fightInterval);
            $this.fightInterval = null
        }

        // move to safezone
        if (moveToSafeZone) {
            $('.safeZone').trigger('click');
        }

        if (LocalStorage.get(Automate.OPTIONS.autoFightRunning, 'false') !== 'false') {
            if (LocalStorage.get('auto-fight-safe-zone', 'false') !== 'false') {
                Automate.moveToSafeZone(Events.AutoFightSwitchChar);
            } else {
                Events.trigger(Events.AutoFightSwitchChar);
            }
        }
    },

    ajaxFight: function () {
        const $this = this;

        if (LocalStorage.get(Options.OPTIONS.ajaxFight, 'false') === 'false') {
            return false;
        }

        if (!Addon.checkUrl('/listeCombats')) {
            return false;
        }

        let $list = $('.zone2 table tr.couleurAlt');

        $list.each(function (fightIndex, val) {
            Addon.listFighters[fightIndex] = val;
            Addon.listFightersTmp[fightIndex] = val.cloneNode(true);
            let $tdCombat = $(val).find('td')[3];

            let $idCombat = $($tdCombat).find('a').attr('href').replace('/combattre/', '');
            let urlCombat = 'https://' + document.domain + '/combattre/' + $idCombat;

            let $newHtml = $('<span class="newfight canFight btn btn-secondary" data-id="' + $idCombat + '">Combattre</span>');
            $($tdCombat).html($newHtml);

            $newHtml.on('click', function (e) {
                let selectorCombat = ".newfight[data-id='" + $idCombat + "']";
                if ($(e.target).hasClass('canFight')) {
                    Utility.showLoader(selectorCombat);
                    $.ajax({
                        url: urlCombat,
                        type: 'GET',
                        crossDomain: true,
                    }).done(function (response) {
                        $this.handleFightResult(selectorCombat, fightIndex, response);
                    })

                    $(e.target).removeClass('canFight');
                }
            });

        });
    },

    /**
     * Traitement du résultat du combat
     */
    handleFightResult: function (selectorCombat, fightIndex, response) {
        const $this = this;

        let regex = /^var tableauDeCombat = (\[(.*)]);$/;
        let myRegex = new RegExp(regex, "gm")
        let matches = myRegex.exec(response);

        if (matches !== null) {
            let historicFight = JSON.parse(matches[1]);


            if (LocalStorage.get(Options.OPTIONS.customThemeEnabled, 'false') === 'false') {

                // custom theme disabled
                $('.zone1sub').html($(response).find('.zone1sub').html());

            } else {

                // custom theme enabled
                Theme.updateInfosPerso($(response).find('.zone1').html());

            }

            Addon.addBonusCharacterPointsOnInfoPlayer();

            let maxRound = historicFight.length - 1;

            let resultFight = historicFight[maxRound]['J1']['Resultat'];
            if (historicFight[maxRound]['J2']['Resultat'] === 'Mort') {
                resultFight = resultFight + ' : Tu as tué cette merde'
            }

            let resultFightClass;
            switch (resultFight) {
                default:
                    resultFightClass = 'btn-primary';
                    break;
                case "Victoire":
                    resultFightClass = 'btn-success';
                    break;
                case "Defaite":
                    resultFightClass = 'btn-warning';
                    break;
                case "Mort":
                    resultFightClass = 'btn-danger';
                    break;
            }
            $(selectorCombat).removeClass('btn-secondary btn-dark').addClass(resultFightClass);

            Utility.hideLoader(selectorCombat, resultFight);

            delete Addon.listFightersTmp[fightIndex];
        }
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.red, 'Fights', ...args);
    },

}