const Fights = window.FightsComponent = {

    // variables
    selectedLife: 100000,
    selectedRatio: 1,
    selectedLevel: 0,

    fightIndex: 0,
    fightInterval: null,

    init: function () {
        const $this = this;

        if ($this.debug) $this.log('Debug mode is active');

        $this.addAutoFightFormToView().then(() => {
            $this.log('Form initialized');
        });

        $this.ajaxFight();
    },

    addAutoFightFormToView: async function () {
        const $this = this;

        if (!Addon.checkUrl('https://www.jeuheros.fr/listeCombats')) {
            return false;
        }

        await Addon.updateCharacterInfos((response) => {
            let $section = $(
                '<section id="zoneBoss2">' +
                '<h2>Combats automatiques</h2>' +
                '</section>'
            ).prependTo($('.zone2'));
            let $group = $(
                '<div class="input-group mb-3">'
            ).appendTo($section);

            // LIFE

            let $labelLife = $(
                '<div class="input-group-prepend">' +
                '<span class="input-group-text">Vie max</span>' +
                '</div>'
            ).appendTo($group);

            $this.selectedLife = parseInt(Cookies.get(`${Addon.characterInfos.slug}-life`)) || 0;
            let $inputLife = $(
                `<input type="number" min="0" step="10000" class="form-control" name="limitLifeInput" id="limitLifeInput" value="${$this.selectedLife}"/>`
            )
                .on('change', function () {
                    $this.selectedLife = parseInt($(this).val());
                    Cookies.set(`${Addon.characterInfos.slug}-life`, $this.selectedLife)
                }).appendTo($group);

            // RATIO

            let $labelRatio = $(
                '<div class="input-group-prepend">' +
                '<span class="input-group-text">Ratio max</span>' +
                '</div>'
            ).appendTo($group);

            $this.selectedRatio = parseFloat(Cookies.get(`${Addon.characterInfos.slug}-ratio`)) || 1.2;
            let $inputRatio = $(`<input type="number" min="0" step="0.1" class="form-control" name="ratioInput" id="ratioInput" value="${$this.selectedRatio}"/>`)
                .on('change', function () {
                    $this.selectedRatio = parseFloat($(this).val());
                    Cookies.set(`${Addon.characterInfos.slug}-ratio`, $this.selectedRatio)
                }).appendTo($group);

            // LEVEL

            let $labelLevel = $(
                '<div class="input-group-prepend">' +
                '<span class="input-group-text">Level max (différence)</span>' +
                '</div>'
            ).appendTo($group);

            $this.selectedLevel = parseFloat(Cookies.get(`${Addon.characterInfos.slug}-level`)) || 1;
            let $inputLevel = $(`<input type="number" min="0" step="1" class="form-control" name="ratioInput" id="ratioInput" value="${$this.selectedLevel}"/>`)
                .on('change', function () {
                    $this.selectedLevel = parseFloat($(this).val());
                    Cookies.set(`${Addon.characterInfos.slug}-level`, $this.selectedLevel)
                }).appendTo($group);

            // BOUTON SAFEZONE

            let $labelSafeZone = $('<label for="goToSafeZone">Aller en safe zone après</label>');
            let $checkboxSafeZone = $('<input type="checkbox" name="goToSafeZone" id="goToSafeZone" class="ml-1" />');

            // BUTTON LANCER LES COMBATS

            let $startBtn = $('<div class="input-group-append"><button type="button" class="btn btn-primary">Lancer les combats</button></div>')
                .appendTo($group)
                .on('click', function () {
                    if ($this.fightInterval !== null) {
                        return false;
                    }

                    $this.fightIndex = 0;
                    $this.fightInterval = setInterval(() => {
                        $this.fightLoop();
                    }, 1000);
                });

            let $stopBtn = $('<div class="input-group-append"><button type="button" class="btn btn-dark">Stop</button></div>')
                .appendTo($group)
                .on('click', function () {
                    if (!Addon.acceptAllFightRunning) {
                        clearTimeout($this.fightInterval);
                        $this.fightInterval = null
                    }
                })
        });
    },

    fightLoop: function () {
        const $this = this;

        let stopLoop = false;

        while (!stopLoop && $this.fightIndex < Object.keys(Addon.listFighters).length) {
            let $fighter = $(Addon.listFighters[$this.fightIndex]);

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

            if (isLifeSafe && isRatioSafe && isLevelSafe) {

                $this.log(`Start fight with ${fightLabel} !`)

                // send fight
                $fighter.find('.newfight')
                    .removeClass('btn-dark')
                    .addClass('btn-secondary')
                    .trigger('click');

                stopLoop = true;

            } else {

                $this.log(`Avoid fighting with ${fightLabel}...`)

                // mark fight as dangerous
                $fighter.find('.newfight')
                    .removeClass('btn-secondary')
                    .addClass('btn-dark')

            }

            $this.fightIndex++;
        }
    },

    ajaxFight: function () {
        if (!Addon.checkUrl('https://www.jeuheros.fr/listeCombats')) {
            return false;
        }

        let $list = $('.zone2 table tr.couleurAlt');

        $list.each(function (key, val) {
            Addon.listFighters[key] = val;
            let $tdCombat = $(val).find('td')[3];

            let $idCombat = $($tdCombat).find('a').attr('href').replace('/combattre/', '');
            let urlCombat = 'https://www.jeuheros.fr/combattre/' + $idCombat;

            let $newHtml = $('<span class="newfight canFight btn btn-secondary" data-id="' + $idCombat + '">Combattre</span>');
            $($tdCombat).html($newHtml);
            $newHtml.on('click', function (e) {
                let selectorCombat = ".newfight[data-id='" + $idCombat + "']";
                if ($(e.target).hasClass('canFight')) {
                    Utility.showLoader(selectorCombat);
                    $.ajax({
                        url: urlCombat,
                        type: 'GET',
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
                        }
                    })

                    $(e.target).removeClass('canFight');
                }
            });

        });
    },

    log: function (...args) {
        Logger.log(Logger.LOG.fg.red, 'Fights', ...args);
    },

}