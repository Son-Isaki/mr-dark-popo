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

    init: function () {
        const $this = this;

        $this.bind();
        $this.ajaxFight();

        $this.log('Initialized');
    },

    bind: function () {
        const $this = this;

        $(document).on(Events.CharacterLoaded, function () {
            $this.addAutoFightFormToView();
        });
    },

    addAutoFightFormToView: function () {
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

        $this.selectedLife = parseInt(Cookies.get(`${Addon.characterInfos.slug}-life`));
        if (typeof $this.selectedLife === 'undefined' || isNaN($this.selectedLife))
            $this.selectedLife = $this.defaultLife;
        $(`<td><input type="number" min="${this.defaultLife}" step="10000" class="form-control" name="limitLifeInput" id="limitLifeInput" value="${$this.selectedLife}"/></td>`)
            .appendTo($secondRow)
            .on('change', function () {
                $this.selectedLife = parseInt($(this).find('input').val());
                $this.log('Vie max modifiée', $this.selectedLife)
                Cookies.set(`${Addon.characterInfos.slug}-life`, $this.selectedLife, {expires: Addon.cookiesDuration})
            })

        // RATIO

        $('<td><label for="ratioInput" title="Evite les combats contre des héros dont le ratio est supérieur au montant">Ratio max</label></td>')
            .appendTo($firstRow);

        $this.selectedRatio = parseFloat(Cookies.get(`${Addon.characterInfos.slug}-ratio`));
        if (typeof $this.selectedRatio === 'undefined' || isNaN($this.selectedRatio))
            $this.selectedRatio = $this.defaultRatio;
        $(`<td><input type="number" min="0" step="0.1" class="form-control" name="ratioInput" id="ratioInput" value="${$this.selectedRatio}"/></td>`)
            .appendTo($secondRow)
            .on('change', function () {
                $this.selectedRatio = parseFloat($(this).find('input').val());
                $this.log('Ratio max modifié', $this.selectedRatio)
                Cookies.set(`${Addon.characterInfos.slug}-ratio`, $this.selectedRatio, {expires: Addon.cookiesDuration})
            })

        // LEVEL

        $('<td><label for="levelInput" title="Evite les combats contre des héros dont la différence de niveau est supérieur au montant">Niveau max <span style="font-size:.7em;">(différence)</span></label></td>')
            .appendTo($firstRow);

        $this.selectedLevel = parseFloat(Cookies.get(`${Addon.characterInfos.slug}-level`));
        if (typeof $this.selectedLevel === 'undefined' || isNaN($this.selectedLevel))
            $this.selectedLevel = $this.defaultLevel;
        $(`<td><input type="number" min="0" step="1" class="form-control" name="levelInput" id="levelInput" value="${$this.selectedLevel}"/></td>`)
            .appendTo($secondRow)
            .on('change', function () {
                $this.selectedLevel = parseFloat($(this).find('input').val());
                $this.log('Niveau max modifié', $this.selectedLevel)
                Cookies.set(`${Addon.characterInfos.slug}-level`, $this.selectedLevel, {expires: Addon.cookiesDuration})
            })

        // BOUTON SAFEZONE

        $('<td><label for="goToSafeZone" class="m-0" title="Déplace le héro en safezone après le combat">Safe zone</label></td>')
            .appendTo($firstRow);

        $this.moveToSafezoneAfter = Cookies.get(`${Addon.characterInfos.slug}-safezone`) === 'true';
        if (typeof $this.moveToSafezoneAfter === 'undefined')
            $this.moveToSafezoneAfter = false;

        $(`<td><input type="checkbox" name="goToSafeZone" id="goToSafeZone" class="ml-1" ${$this.moveToSafezoneAfter ? "checked=\"checked\"" : ""} /></td>`)
            .appendTo($secondRow)
            .find('input')
            .on('change', function () {
                $this.moveToSafezoneAfter = $('#goToSafeZone').prop('checked');
                $this.log('Safezone modifié', $this.moveToSafezoneAfter)
                Cookies.set(`${Addon.characterInfos.slug}-safezone`, $this.moveToSafezoneAfter, {expires: Addon.cookiesDuration})
            });

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
            delete Addon.listFighters[$this.fightIndex];

            let fightLabel = Utility.trim($fighter.find('td').eq(0).text());

            // life
            let currentLifeCharacter = parseInt(Utility.getCurrentLifeCharacter());
            let isLifeSafe = currentLifeCharacter > $this.selectedLife;

            // ratio
            let fightStats = $fighter.find('td').eq(2).text().split('/');
            let fightRatio = (parseInt(fightStats[0]) + parseInt(fightStats[2])) / (parseInt(fightStats[1]));
            let isRatioSafe = fightRatio <= $this.selectedRatio;

            // level
            let fightLevel = parseInt($fighter.find('td').eq(1).text());
            let isLevelSafe = Addon.characterInfos.level >= fightLevel + $this.selectedLevel;

            if (fightLevel < Addon.characterInfos.level) {
                $this.terminateFightLoop($this.moveToSafezoneAfter);
                return false;
            }

            if (isLifeSafe && isRatioSafe && isLevelSafe) {

                $this.log(`Start fight with ${fightLabel} !`)

                // send fight
                $fighter.find('.newfight')
                    .removeClass('btn-dark')
                    .addClass('btn-secondary')
                    .trigger('click');

                stopLoop = true;

            } else if (!isLifeSafe) {

                // plus assez de vie, fin des combats
                $this.terminateFightLoop($this.moveToSafezoneAfter);

            } else {

                $this.log(`Avoid fighting with ${fightLabel}...`)

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
    },

    ajaxFight: function () {
        if (!Addon.checkUrl('/listeCombats')) {
            return false;
        }

        let $list = $('.zone2 table tr.couleurAlt');

        $list.each(function (key, val) {
            Addon.listFighters[key] = val;
            let $tdCombat = $(val).find('td')[3];

            let $idCombat = $($tdCombat).find('a').attr('href').replace('/combattre/', '');
            let urlCombat = 'https://'+document.domain+'/combattre/' + $idCombat;

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
                        let regex = /^var tableauDeCombat = (\[(.*)]);$/;
                        let myRegex = new RegExp(regex, "gm")
                        let matches = myRegex.exec(response);

                        if (matches !== null) {
                            let historicFight = JSON.parse(matches[1]);
                            Utility.refreshInfoUser($(response).find('.zone1sub').html());

                            let maxRound = historicFight.length - 1;

                            let resultFight = historicFight[maxRound]['J1']['Resultat'];
                            if (historicFight[maxRound]['J2']['Resultat'] === 'Mort') {
                                resultFight = resultFight + ' : Tu as tué cette merde'
                            }

                            let resultFightClass;
                            switch (resultFight) {
                                default:
                                    resultFightClass = 'btn-primary'
                                    break;

                                case "Victoire":
                                    resultFightClass = 'btn-success'
                                    break;

                                case "Defaite":
                                    resultFightClass = 'btn-warning'
                                    break;

                                case "Mort":
                                    resultFightClass = 'btn-danger'
                                    break;
                            }
                            $(selectorCombat).removeClass('btn-secondary btn-dark').addClass(resultFightClass);

                            Utility.hideLoader(selectorCombat, resultFight);
                            Addon.reloadInfoPlayer();
                            delete Addon.listFighters[key];
                        }
                    })

                    $(e.target).removeClass('canFight');
                }
            });

        });
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.red, 'Fights', ...args);
    },

}