const Addon = window.Addon = {

    // variables
    debug: true,

    currentUrl: undefined,
    refreshCharacterUrl: undefined,

    gamerId: undefined,

    currentCharacter: Character,

    hasAccess: false,
    config: [],
    acceptAllFightRunning: false,
    listFighters: {},
    listFightersTmp: {},

    listCharactersHtml: [],

    init: function () {
        const $this = this;

        if ($this.debug) $this.log('Debug mode is active');
        else $this.log('Debug mode is inactive');

        Utility.includeStyle('dist/css/app.min.css')

        // variables
        $this.currentUrl = document.URL;
        $this.refreshCharacterUrl = $('.imgPersoActuelDiv a:first-child').attr('href');

        // $this.initGameLoader();
        $this.bind();

        // Game options
        Options.initOptions();

        // initialization
        $this.addLinkToOptions();
        $this.addActionsZoneToView();
        $this.addAllPointsOnStatsBtn();
        $this.addDisplayAllCharactersBtn();
        $this.changeAlertPosition();
        $this.addValidLinkHistoryMode();
        $this.addHistoryOnMap();
        $this.reverseInfoPlayerOnFight();
        $this.showTimerRefreshLife();
        $this.reloadInfoPlayer();
        $this.updateNavbarTop();
        $this.makeNavbarFixed();
        $this.stuckInfoPlayerOnScroll();

        $this.addBtnSendAllCharInMagTrain();
        $this.addBtnSendAllCharInDefTrain();
        $this.addBtnSendAllCharInAtqTrain();

        $this.log("Initialized");
    },

    bind: function () {
        const $this = this;

        Events.register(Events.LevelsLoaded, () => {
            $this.requestCharacterData();
        });

        Events.register(Events.CharacterLoaded, () => {
            setTimeout(() => {
                $this.hideGameLoader();
            }, 10);
        });
    },

    addActionsZoneToView: function () {
        $('<div id="actions-zone">')
            .appendTo($('.zone1'));
    },

    addLinkToOptions: function () {
        let $menu = $('#navbarColor02 ul').not('.mr-auto');

        let $profileLink = $menu
            .find('li.nav-item')
            .eq(0)
            .find('a')
            .attr('href');

        let $link = $('<li class="nav-item"><a href="' + $profileLink + '/?addOn" class="nav-link">Addon</a></li>');

        $menu.prepend($link);
    },

    /**
     * Request current character data
     *
     * @returns {Promise<Character>}
     */
    requestCharacterData: async function () {
        const $this = this;

        await Utility.getPageContent($this.refreshCharacterUrl, (response) => {
            let character = new Character(response);
            character = Avatar.AddCustomAvatarToCharacter(character)
            $this.currentCharacter = character;
            Events.trigger(Events.CharacterLoaded, character);
        });
    },

    stuckInfoPlayerOnScroll: function () {
        if (LocalStorage.get(Options.OPTIONS.fixInfoPlayerOnScroll, 'false') === 'false') {
            return false;
        }

        const $this = this;

        $(window).scroll(() => {
            let $scrollTop = $(window).scrollTop();

            let $blockToMove = $('.zone1');
            $blockToMove.css({
                position: 'relative',
                top: $scrollTop + 'px'
            });
        });
    },

    addAllPointsOnStatsBtn: function () {
        if (LocalStorage.get(Options.OPTIONS.btnAddRemoveAllBonusPoints, 'false') === 'false') {
            return false;
        }

        let availableUrl = 'https://' + document.domain + '/perso/addpoints/';

        if (Addon.currentUrl !== availableUrl) {
            return false;
        }

        let $selector = $('.zone2 form .form-group');

        let initialMaxPoints = parseInt($('#points').html());

        $selector.each(function ($key, $val) {
            if ($($val).find('input').length > 0) {
                let $btnRemoveAll = $('<button class="btn btn-danger" type="button">Tout enlever</button>');
                let $btnAddAll = $('<button class="btn btn-primary" type="button">Tout mettre</button>');

                let $selector;

                switch ($key) {
                    default:
                    case 0:
                        $selector = '#points_personnage_type_form_pointsForce';
                        break;

                    case 1:
                        $selector = '#points_personnage_type_form_pointsDefense';
                        break;

                    case 2:
                        $selector = '#points_personnage_type_form_pointsMagie';
                        break;
                }

                $btnRemoveAll.on('click', function () {
                    let $selectorMaxPoints = '#points';

                    let $maxPoints = parseInt($($selectorMaxPoints).html());
                    if ($maxPoints < initialMaxPoints) {
                        let $valueInput = parseInt($($selector).val());
                        if ($valueInput !== 0) {
                            $maxPoints += $valueInput;
                            $valueInput -= $valueInput;
                            $($selector).val($valueInput);
                            $($selectorMaxPoints).html($maxPoints);
                        }
                    }
                });

                $btnAddAll.on('click', function () {
                    let $selectorMaxPoints = '#points';

                    let $maxPoints = parseInt($($selectorMaxPoints).html());
                    if ($maxPoints > 0) {
                        $($selector).val($maxPoints);
                        $maxPoints -= $maxPoints;
                        $($selectorMaxPoints).html($maxPoints);
                    }
                });

                $($val).after($btnAddAll).after($btnRemoveAll);
            }
        });
    },

    addDisplayAllCharactersBtn: function () {
        if (LocalStorage.get(Options.OPTIONS.btnDisplayAllChars, 'false') === 'false') {
            return false;
        }

        if (!Addon.checkUrl('/perso/listePersonnage/')) {
            return false;
        }

        let $selector = '.zoneCapsulesEquipe5';

        let $html = $('<p>' +
            '    <button class="btn btn-primary" type="button" data-type="all">' +
            '        Tous' +
            '    </button>' +
            '    </p>')


        $($html).on('click', function (e) {
            let tags = ['dragonball', 'naruto', 'onepiece', 'bleach', 'CCSXSM', 'autre'];

            $(tags).each(function (key, val) {
                let selectorCat = '#' + val + 'Persos';
                $(selectorCat).toggleClass('cachePersonnage');
            });
        });

        $($selector).append($html);
    },

    changeAlertPosition: function () {
        setTimeout(function () {
            $('.fenalert').remove();
        }, 2000);
    },

    addValidLinkHistoryMode: function () {
        if (LocalStorage.get(Options.OPTIONS.validLinkHistoryMode, 'false') === 'false') {
            return false;
        }

        if (!Addon.checkUrl('/carte')) {
            return false;
        }

        let selector = '.liensQuetes';
        if ($(selector).length > 0) {
            let $html = $(selector).clone(true);
            $html.prepend('<br>Valider : ');

            let $url = $($html).attr('href');
            let newUrl = $url.replace('histoireContinue', 'histoireValide');

            $($html).attr('href', newUrl);

            $(selector).after($html);

            $($html).on('click', function (e) {
                e.preventDefault();
                let fullUrl = 'https://' + document.domain + newUrl;
                $.ajax({
                    type: 'GET',
                    url: fullUrl,
                    crossDomain: true,
                }).done(function (response) {
                    window.location.href = 'https://' + document.domain + '/carte';
                });
            });
        }
    },

    addHistoryOnMap: function () {
        if (LocalStorage.get(Options.OPTIONS.showHistoryModeOnMap, 'false') === 'false') {
            return false;
        }


        if (!Addon.checkUrl('/carte')) {
            return false;
        }

        $.ajax({
            url: 'https://' + document.domain + '/histoireInfo',
            type: 'GET',
            crossDomain: true,
        }).done(function (response) {
            let $historyFromAjax = $(response).find('.fondBlancOnly');

            let $row = $('<div class="map-row">')
                .prependTo($('.zone2'));

            $('.carteZone').appendTo($row);
            $('.flexChoixCarte').appendTo($row);

            $($historyFromAjax).css('marginRight', '10px');

            let $tutoriel = $($historyFromAjax[0]).find('article:contains(Tu as terminé le tutoriel)');

            if ($tutoriel.length > 0) {
                $tutoriel.remove();
            }

            let $articles = $($historyFromAjax[0]).find('article');

            $articles[3].remove();
            $articles[4].remove();

            $('.flexChoixMap').append($historyFromAjax);
        });
    },

    reverseInfoPlayerOnFight: function () {
        if (LocalStorage.get(Options.OPTIONS.reverseInfoPlayer, 'false') === 'false') {
            return false;
        }

        $('body').addClass('reverse-info-player')
    },

    addBonusCharacterPointsOnInfoPlayer: function () {
        if (LocalStorage.get(Options.OPTIONS.showBonusCharacterPoints, 'false') === 'false') {
            return false;
        }


        if (Addon.currentUrl !== 'https://' + document.domain + '/perso/infoPersonnage') {
            $.ajax({
                url: 'https://' + document.domain + '/perso/infoPersonnage',
                type: 'GET',
                crossDomain: true,
            }).done(function (response) {
                $('.link-bonus-points').remove();
                $(response).find("a[href='/perso/addpoints/']")
                    .addClass('link-bonus-points')
                    .insertAfter($('.infos-perso-row'));
            });
        } else {
            $('.link-bonus-points').remove();
            $('.zoneFlexAutresStats').find("a[href='/perso/addpoints/']")
                .clone(true)
                .addClass('link-bonus-points')
                .insertAfter($('.imgPersoActuelDiv'));
        }
    },

    showTimerRefreshLife: function () {
        if (LocalStorage.get(Options.OPTIONS.showTimerRefreshLife, 'false') === 'false') {
            $('#timerRefreshLife').remove();
            clearInterval(Addon.timerRefreshLifeInterval);
            return false;
        }


        Addon.timerRefreshLifeInterval = setInterval(function () {
            let currentTime = new Date(); // Récupère l'heure actuelle
            let targetTime = new Date(); // Initialise l'heure cible
            targetTime.setMinutes(41); // Définit les minutes à 41
            targetTime.setSeconds(0); // Définit les secondes à 0

            // Si l'heure actuelle est supérieure à l'heure cible, ajoute 1 heure à l'heure cible
            if (currentTime > targetTime) {
                targetTime.setHours(targetTime.getHours() + 1);
            }

            let timeDifference = targetTime - currentTime; // Calcule la différence entre l'heure cible et l'heure actuelle

            // Calcule les heures, minutes et secondes restantes
            let hours = Math.floor(timeDifference / (1000 * 60 * 60));
            let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');


            // Affiche le compte à rebours
            let $html = $("<li id='timerRefreshLife'><span class='nav-link' style='color: #D9D9D9;'><span class='minutes'>" + minutes + "</span>:<span class='seconds'>" + seconds + "</span></span></li>");

            if ($('ul.nav.mr-auto #timerRefreshLife').length > 0) {
                // $('#timerRefreshLife .hours').html(hours);
                $('#timerRefreshLife .minutes').html(minutes);
                $('#timerRefreshLife .seconds').html(seconds);
            } else {
                $('ul.nav.mr-auto').append($html);
            }
        }, 1000);
    },

    reloadInfoPlayer: function () {
        const $this = this;

        $this.addBonusCharacterPointsOnInfoPlayer();

        $('#actions-zone').empty();
        $this.addBtnGoToSafeZone();
        $this.addBtnInstantHeal70();
        $this.addBtnUseFioleOnChar();
        $this.addBtnGoToShopEarth();
        $this.addBtnGoToCapsMarket()
        $this.addBtnGoToObjMarket()
        $this.addBtnGoToFightZone();
        $this.addBtnFightToTower();
        $this.addBtnGoToTrainAtqEarth();
        $this.addBtnGoToTrainDefEarth();
        $this.addBtnGoToTrainMagEarth();

        Events.trigger(Events.ReloadInfosPersos);
    },

    addBtnGoToSafeZone: function () {
        if (LocalStorage.get(Options.OPTIONS.showSafeZoneInActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-success safeZone">Safezone</button>')
            .on('click', function () {
                Automate.moveToSafeZone();
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToShopEarth: function () {
        if (LocalStorage.get(Options.OPTIONS.showShopInActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-warning">Boutique de capsules Terre</button>')
            .on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'https://' + document.domain + '/carte/move/44',
                    crossDomain: true,
                }).done(function () {
                    window.location.href = 'https://' + document.domain + '/magasinCapsules';
                });
            })
            .appendTo($('#actions-zone'));
    },

    addBtnUseFioleOnChar: function() {
        if (LocalStorage.get(Options.OPTIONS.showUseFioleInActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-success">Utiliser une fiole</button>')
            .on('click', function () {
                window.location.href = 'https://www.jeuheros.fr/baba/puissance';
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToCapsMarket: function () {
        if (LocalStorage.get(Options.OPTIONS.showGoToCapsMarketActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-warning">Marché aux Capsules</button>')
            .on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'https://www.jeuheros.fr/carte/move/38',
                    crossDomain: true,
                }).done( () => {
                    window.location.href = 'https://www.jeuheros.fr/magasin/venteCapsules';
                });
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToObjMarket: function () {
        if (LocalStorage.get(Options.OPTIONS.showGoToObjMarketActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-warning">Marché aux Objets</button>')
            .on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'https://www.jeuheros.fr/carte/move/38',
                    crossDomain: true,
                }).done( () => {
                    window.location.href = 'https://www.jeuheros.fr/magasin/venteObjets';
                });
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToFightZone: function () {
        if (LocalStorage.get(Options.OPTIONS.showFightZoneInActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-danger">Zone de combat</button>')
            .on('click', function () {
                Automate.moveToFightZone();
            })
            .appendTo($('#actions-zone'));
    },

    addBtnInstantHeal70: function () {
        if (LocalStorage.get(Options.OPTIONS.showHealInActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-success">Heal 70%</button>')
            .on('click', function () {
                $.ajax({
                    type: 'GET',
                    url: 'https://' + document.domain + '/soins',
                    crossDomain: true,
                }).done(function (response) {
                    $(response).find('#soins_choixSoins').val('20000');

                    let form = $(response).find('form[name="soins"]');

                    Addon.log(form, form.serialize().replace('5000', '20000'));

                    $.ajax({
                        type: 'POST',
                        url: 'https://' + document.domain + '/soins',
                        data: form.serialize().replace('5000', '20000'),
                        crossDomain: true,
                        success: function (data) {
                            window.location.href = 'https://' + document.domain + '/listeCombats';
                        }
                    })
                });
            })
            .appendTo($('#actions-zone'));
    },

    addBtnFightToTower: function () {
        if (LocalStorage.get(Options.OPTIONS.showFightTourInActions, 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-danger">Tour de combat</button>')
            .on('click', function () {
                window.location.href = 'https://' + document.domain + '/tour/combat';
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToTrainAtqEarth: function () {
        if (LocalStorage.get(Options.OPTIONS.showTrainsInActions, 'false') === 'false') {
            return false;
        }

        if (LocalStorage.get('show-train-attaque-actions', 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-primary">Train attaque</button>')
            .on('click', function () {
                if (!Utility.checkPlanetForCurrentCharacter('terre')) {
                    Automate.changePlanet(Automate.putCharInTrain, 'attaque')
                } else {
                    Automate.putCharInTrain('attaque');
                }
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToTrainMagEarth: function () {
        if (LocalStorage.get(Options.OPTIONS.showTrainsInActions, 'false') === 'false') {
            return false;
        }

        if (LocalStorage.get('show-train-magie-actions', 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-primary">Train magie</button>')
            .on('click', function () {
                if (!Utility.checkPlanetForCurrentCharacter('terre')) {
                    Automate.changePlanet(Automate.putCharInTrain, 'magie')
                } else {
                    Automate.putCharInTrain('magie');
                }
            })
            .appendTo($('#actions-zone'));
    },

    addBtnGoToTrainDefEarth: function () {
        if (LocalStorage.get(Options.OPTIONS.showTrainsInActions, 'false') === 'false') {
            return false;
        }

        if (LocalStorage.get('show-train-defense-actions', 'false') === 'false') {
            return false;
        }

        $('<button type="button" class="btn btn-sm btn-primary">Train défense</button>')
            .on('click', function () {
                if (!Utility.checkPlanetForCurrentCharacter('terre')) {
                    Automate.changePlanet(Automate.putCharInTrain, 'defense')
                } else {
                    Automate.putCharInTrain('defense');
                }
            })
            .appendTo($('#actions-zone'));
    },

    addBtnSendAllCharInAtqTrain: function() {
        let $tabMenu = $('nav.navbar li.dropdown').eq(0);
        let $dropdownChar = $($tabMenu).find('.dropdown-menu').eq(0);

        if (LocalStorage.get(Options.OPTIONS.showPutAllCharsOnTrainInActions, 'false') === 'false') {
            return false;
        }

        if (LocalStorage.get('show-train-all-characters-attaque-actions', 'false') === 'false') {
            return false;
        }

        $('<a class="dropdown-item putAllCharInTrainAtq" href="#">Envoyer perso fav. en train ATTAQUE</a>')
            .on('click', () => {
                if (Safezone.characterInterval === null) {
                    Notify.notify('Déplacement des personnages favoris en entraînement attaque en cours');
                    Safezone.characterIndex = 0;
                    Safezone.characterInterval = setInterval(() => {
                        Automate.putAllFavCharacterInTrain('attaque');
                    }, 3000)
                }
            })
            .prependTo($dropdownChar);
    },

    addBtnSendAllCharInDefTrain: function() {
        let $tabMenu = $('nav.navbar li.dropdown').eq(0);
        let $dropdownChar = $($tabMenu).find('.dropdown-menu').eq(0);

        if (LocalStorage.get(Options.OPTIONS.showPutAllCharsOnTrainInActions, 'false') === 'false') {
            return false;
        }

        if (LocalStorage.get('show-train-all-characters-defense-actions', 'false') === 'false') {
            return false;
        }

        $('<a class="dropdown-item putAllCharInTrainDef" href="#">Envoyer perso fav. en train DÉFENSE</a>')
            .on('click', () => {
                if (Safezone.characterInterval === null) {
                    Notify.notify('Déplacement des personnages favoris en entraînement défense en cours');
                    Safezone.characterIndex = 0;
                    Safezone.characterInterval = setInterval(() => {
                        Automate.putAllFavCharacterInTrain('defense');
                    }, 3000)
                }
            })
            .prependTo($dropdownChar);
    },

    addBtnSendAllCharInMagTrain: function() {
        let $tabMenu = $('nav.navbar li.dropdown').eq(0);
        let $dropdownChar = $($tabMenu).find('.dropdown-menu').eq(0);

        if (LocalStorage.get(Options.OPTIONS.showPutAllCharsOnTrainInActions, 'false') === 'false') {
            return false;
        }

        if (LocalStorage.get('show-train-all-characters-magie-actions', 'false') === 'false') {
            return false;
        }

        $('<a class="dropdown-item putAllCharInTrainMag" href="#">Envoyer perso fav. en train MAGIE</a>')
            .on('click', () => {
                if (Safezone.characterInterval === null) {
                    Notify.notify('Déplacement des personnages favoris en entraînement magie en cours');
                    Safezone.characterIndex = 0;
                    Safezone.characterInterval = setInterval(() => {
                        Automate.putAllFavCharacterInTrain('magie');
                    }, 3000)
                }
            })
            .prependTo($dropdownChar);
    },

    updateNavbarTop: function () {
        let $tabMenu = $('nav.navbar li.dropdown').eq(0);
        let $dropdownChar = $($tabMenu).find('.dropdown-menu').eq(0);

        if (LocalStorage.get(Options.OPTIONS.removeLinkInfoPerso, 'false') !== 'false') {
            $($tabMenu).find('a[href="/perso/infoPersonnage"]').remove();
        }

        if (LocalStorage.get(Options.OPTIONS.showLinkMoveAllChars, 'false') !== 'false') {
            // safezone
            $('<a class="dropdown-item putAllCharInFightZone text-danger" href="#">Sortir tous les personnages favoris</a>')
                .prependTo($dropdownChar)
                .on('click', () => {
                    Addon.listCharactersHtml = $('nav.navbar li.dropdown')
                        .eq(0)
                        .find('div.dropdown-menu div.dropdown-menu')
                        .find('a.dropdown-item')
                        .clone(true);
                    Notify.notify('Déplacement des personnages favoris en fight zone en cours');
                    Safezone.characterIndex = 0;
                    Safezone.characterInterval = setInterval(() => {
                        Safezone.putAllCharInFightZone();
                    }, 1500)
                });
            $('<a class="dropdown-item putAllCharInSafeZone text-success" href="#">Rentrer tous les personnages favoris</a>')
                .prependTo($dropdownChar)
                .on('click', () => {
                    Addon.listCharactersHtml = $('nav.navbar li.dropdown')
                        .eq(0)
                        .find('div.dropdown-menu div.dropdown-menu')
                        .find('a.dropdown-item')
                        .clone(true);
                    Notify.notify('Déplacement des personnages favoris en safe zone en cours');
                    Safezone.characterIndex = 0;
                    Safezone.characterInterval = setInterval(() => {
                        Safezone.putAllCharInSafeZone();
                    }, 1500)
                });
        }

        if (LocalStorage.get(Options.OPTIONS.changeCharacterColorUnavailable, 'false') !== 'false') {
            Addon.changeColorCharacterOnList();
        }

    },

    changeColorCharacterOnList: function () {
        Addon.listCharactersHtml = $('nav.navbar li.dropdown')
            .eq(0)
            .find('div.dropdown-menu div.dropdown-menu')
            .find('a.dropdown-item');

        $.each(Addon.listCharactersHtml, function (key, item) {
            let imgs = $(item).find('img');

            if (imgs.length <= 3) {
                // $(item).addClass('text-success');
            } else {
                let $isOnTrain = imgs
                    .eq(3)
                    .attr('src')
                    .indexOf('trainn');

                if ($isOnTrain !== -1) {
                    $(item).addClass('text-danger');
                }
            }
        });
    },

    makeNavbarFixed: function () {
        if (LocalStorage.get(Options.OPTIONS.fixNavbarTop, 'false') === 'false') {
            return false;
        }

        $('nav.navbar').addClass('fixed-top');
    },

    checkUrl: function (match) {
        let fixedMatch = match.split('/').filter(x => x !== '').join('/');
        return Addon.currentUrl.indexOf(fixedMatch) !== -1;
    },

    initGameLoader: function () {
        const $this = this;
        
        $('<style>#game-loader {' +
            '  position: fixed;' +
            '  background-color: #1E1E1E;' +
            '  top: 0;' +
            '  right: 0;' +
            '  bottom: 0;' +
            '  left: 0;' +
            '  opacity: 1;' +
            '  display: block;' +
            '  z-index: 100000;' +
            '}' +
            '#game-loader img, #game-loader embed {' +
            '  position: absolute;' +
            '  left: 50%;' +
            '  top: 50%;' +
            '  -webkit-transform: translate(-50%, -50%);' +
            '  -ms-transform: translate(-50%, -50%);' +
            '  transform: translate(-50%, -50%);' +
            '}' +
            '#game-loader img svg, #game-loader embed svg {' +
            '  background-color: transparent;' +
            '}' +
            '#game-loader.is-hidden {' +
            '  display: block !important;' +
            '  opacity: 0;' +
            '  pointer-events: none;' +
            '  -webkit-transition: all 0.25s ease;' +
            '  transition: all 0.25s ease;' +
            '}</style>')

        let loaderUrl = Utility.getExtensionFilePath('dist/img/game-loader.svg');
        $(`<div id="game-loader"><img src="${loaderUrl}" alt="Le jeu est en train de charger..."></div>`)
            .prependTo($('body'));
        $this.log('initGameLoader');
    },

    hideGameLoader: function () {
        const $this = this;
        $('#game-loader').addClass('is-hidden');
        $this.log('hideGameLoader');
    },

    getGamer: function () {

        let topbar = $('.topbar .right>ul>li');
        let profilLi = topbar[topbar.length - 1];
        let profilLink = $(profilLi).find('a')[0].getAttribute('href');

        this.gamerName = profilLink.replace('https://www.dragonballrebirth.fr/profil/', '');
    },

    canAccess: function (obj) {
        obj.hasAccess = true;
        Addon.start();
    },

    die: function () {
        return;
    },

    blackList: function () {
        blackList.init(Addon.currentUrl);
    },

    alert: function (id, e) {
        alert('Erreur add-on JH #' + id + ':' + e);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.purple, 'Addon', ...args);
    },
};