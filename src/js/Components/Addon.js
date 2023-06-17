const Addon = window.Addon = {

    // variables
    debug: true,

    currentUrl: undefined,
    gamerId: undefined,
    cookiesDuration: 365,

    characterInfos: {},

    hasAccess: false,
    config: [],
    acceptAllFightRunning: false,
    listFighters: {},

    listCharactersHtml: [],

    init: function () {
        const $this = this;

        if ($this.debug) $this.log('Debug mode is active');

        $this.currentUrl = document.URL;

        $this.updateCharacterInfos().then((response) => {
            Events.trigger(Events.CharacterLoaded, $this.characterInfos);
        });
        $this.addAllPointsOnStatsBtn();
        $this.addDisplayAllCharactersBtn();
        $this.changeAlertPosition();
        $this.addValidLinkHistoryMode();
        $this.addHistoryOnMap();
        $this.reverseInfoPlayerOnFight();
        $this.stuckInfoPlayer();
        $this.displayTimerRefreshLife();
        $this.reloadInfoPlayer();
        $this.updateNavbarTop();
        $this.makeNavbarFixed();
        $this.addLinkToOptions();

        Utility.includeStyle('dist/css/app.min.css')

        $this.log("Initialized");

    },

    addLinkToOptions: function () {
        let $menu = $('#navbarColor02 ul').not('.mr-auto');

        let $link = $('<li class="nav-item"><a href="/?addOn" class="nav-link">Addon</a></li>');

        $menu.prepend($link);
    },

    updateCharacterInfos: async function (callback) {
        const $this = this;

        let uri = $('.imgPersoActuelDiv a:first-child').attr('href');

        await Utility.getPageContent(uri, (response) => {
            let data = {};
            let $content = $(response);

            data.name = $content.find('.zone2 .infoPersoAvatar h3').text();
            data.slug = Utility.slugify(data.name);
            data.level = parseInt($content.find('.zone2 .infoPersoAvatar h3 + p').text().replace("Niveau ", ""));

            $this.characterInfos = data;

            if (typeof callback === "function") {
                callback(response);
            }
        });
    },

    addAllPointsOnStatsBtn: function () {
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
        if (!Addon.checkUrl('/perso/listePersonnage/')) {
            return false;
        }

        let $selector = '.zoneCapsulesEquipe5';

        let $html = $('<p>\n' +
            '    <button class="btn btn-primary" type="button" data-type="all">\n' +
            '        Tous\n' +
            '    </button>\n' +
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
        if (!Addon.checkUrl('/carte')) {
            return false;
        }

        $.ajax({
            url: 'https://' + document.domain + '/histoireInfo',
            type: 'GET',
            crossDomain: true,
        }).done(function (response) {
            let $historyFromAjax = $(response).find('.fondBlancOnly');

            $($historyFromAjax).css('marginRight', '10px');

            let $tutoriel = $($historyFromAjax[0]).find('article:contains(Tu as terminé le tutoriel)');

            if ($tutoriel.length > 0) {
                $tutoriel.remove();
            }

            let $articles = $($historyFromAjax[0]).find('article');

            $articles[3].remove();
            $articles[4].remove();

            $('.flexChoixMap').prepend($historyFromAjax);
        });
    },

    reverseInfoPlayerOnFight: function () {
        if (!this.checkUrl('https://' + document.domain + '/listeCombats')) {
            return false;
        }

        $('body').addClass('reverse-info-player')
    },

    addBonusCharacterPointsOnInfoPlayer: function () {
        if (Addon.currentUrl !== 'https://' + document.domain + '/perso/infoPersonnage') {
            $.ajax({
                url: 'https://' + document.domain + '/perso/infoPersonnage',
                type: 'GET',
                crossDomain: true,
            }).done(function (response) {
                let link = $(response).find("a[href='/perso/addpoints/']");
                $(link).css({
                    'marginBottom': '10px',
                    'display': 'block',
                });

                if (link.length > 0) {
                    if ($('.imgPersoActuelDiv').find("a[href='/perso/addpoints/']").length > 0) {
                        return false;
                    }
                    $('.imgPersoActuelDiv').after(link);
                }
            });
        } else {
            let link = $('.zoneFlexAutresStats').find("a[href='/perso/addpoints/']").clone(true);
            $(link).css({
                'marginBottom': '10px',
                'display': 'block',
            });

            if (link.length > 0) {
                if ($('.imgPersoActuelDiv').find("a[href='/perso/addpoints/']").length > 0) {
                    return false;
                }
                $('.imgPersoActuelDiv').after(link);
            }
        }
    },

    stuckInfoPlayer: function () {
        if (!this.checkUrl('https://' + document.domain + '/listeCombats')) {
            return false;
        }

        $('body').addClass('stuck-infos-player');

        $(document).ready(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 1) {
                    $('.flex').addClass('sticky')
                    $('.footerPage').addClass('sticky');
                } else {
                    $('.flex').removeClass("sticky");
                    $('.footerPage').removeClass("sticky");
                }
            });
        });
    },

    displayTimerRefreshLife: function () {

        setInterval(function () {
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
            let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            // Affiche le compte à rebours
            let $html = $("<li id='timerRefreshLife'><span class='nav-link'><span class='hours'>" + hours + "</span>:<span class='minutes'>" + minutes + "</span>:<span class='seconds'>" + seconds + "</span></span></li>");

            if ($('ul.nav.mr-auto #timerRefreshLife').length > 0) {
                $('#timerRefreshLife .hours').html(hours);
                $('#timerRefreshLife .minutes').html(minutes);
                $('#timerRefreshLife .seconds').html(seconds);
            } else {
                $('ul.nav.mr-auto').append($html);
            }
        }, 1000);
    },

    addBtnGoToFightZone: function () {
        const button = document.createElement('button');
        button.textContent = 'Zone de combat Terre';
        button.className = 'btn btn-danger mb-1';
        button.addEventListener('click', () => {
            $.ajax({
                type: 'GET',
                url: 'https://' + document.domain + '/carte/move/68',
                crossDomain: true,
            }).done(function () {
                window.location.href = 'https://' + document.domain + '/listeCombats';
            });
        });

        $('.zone1 .couleurBlack').after(button);
    },

    addBtnGoToTrainAtqEarth: function () {
        const button = document.createElement('button');
        button.textContent = 'Train attaque Terre';
        button.className = 'btn btn-primary mb-1';
        button.addEventListener('click', () => {
            $.ajax({
                type: 'GET',
                url: 'https://' + document.domain + '/carte/move/69',
                crossDomain: true,
            }).done(function () {
                window.location.href = 'https://' + document.domain + '/entrainementAttaque/go';
            });
        });

        $('.zone1 .couleurBlack').after(button);
    },

    addBtnGoToTrainMagEarth: function () {
        const button = document.createElement('button');
        button.textContent = 'Train magie Terre';
        button.className = 'btn btn-primary';
        button.addEventListener('click', () => {
            $.ajax({
                type: 'GET',
                url: 'https://' + document.domain + '/carte/move/22',
                crossDomain: true,
            }).done(function () {
                window.location.href = 'https://' + document.domain + '/entrainementMagie/go';
            });
        });

        $('.zone1 .couleurBlack').after(button);
    },

    addBtnGoToTrainDefEarth: function () {
        const button = document.createElement('button');
        button.textContent = 'Train défense Terre';
        button.className = 'btn btn-primary mb-1';
        button.addEventListener('click', () => {
            $.ajax({
                type: 'GET',
                url: 'https://' + document.domain + '/carte/move/59',
                crossDomain: true,
            }).done(function () {
                window.location.href = 'https://' + document.domain + '/entrainementDefense/go';
            });
        });

        $('.zone1 .couleurBlack').after(button);
    },

    reloadInfoPlayer: function () {
        this.addBonusCharacterPointsOnInfoPlayer();
        this.addBtnGoToTrainMagEarth();
        this.addBtnGoToTrainDefEarth();
        this.addBtnGoToTrainAtqEarth();
        this.addBtnGoToFightZone();
        this.addBtnFightToTower();
        this.addBtnInstantHeal70();
        this.addBtnGoToShopEarth();
        this.addBtnGoToSafeZone();
    },

    addBtnFightToTower: function () {
        const button = document.createElement('button');
        button.textContent = 'Fight Tour';
        button.className = 'btn btn-danger mb-1';
        button.addEventListener('click', () => {
            window.location.href = 'https://' + document.domain + '/tour/combat';
        });

        $('.zone1 .couleurBlack').after(button);
    },

    addBtnGoToSafeZone: function () {
        const button = document.createElement('button');
        button.textContent = 'Safe Zone Terre';
        button.className = 'btn btn-success mb-1 safeZone';
        button.addEventListener('click', () => {
            window.location.href = 'https://' + document.domain + '/carte/move/59';
        });

        $('.zone1 .couleurBlack').after(button);
    },

    addBtnGoToShopEarth: function () {
        const button = document.createElement('button');
        button.textContent = 'Boutique caps Terre';
        button.className = 'btn btn-success mb-1';
        button.addEventListener('click', () => {
            $.ajax({
                type: 'GET',
                url: 'https://' + document.domain + '/carte/move/44',
                crossDomain: true,
            }).done(function () {
                window.location.href = 'https://' + document.domain + '/magasinCapsules';
            });
        });

        $('.zone1 .couleurBlack').after(button);
    },

    updateNavbarTop: function () {
        let $tabMenu = $('nav.navbar li.dropdown').eq(0);
        let $dropdownChar = $($tabMenu).find('.dropdown-menu').eq(0);

        $($tabMenu).find('a[href="/perso/infoPersonnage"]').remove();

        // safezone
        $('<a class="dropdown-item putAllCharInFightZone text-danger" href="#">Sortir tous les personnages</a>')
            .prependTo($dropdownChar)
            .on('click', Addon.putAllCharInFightZone);
        $('<a class="dropdown-item putAllCharInSafeZone text-success" href="#">Rentrer tous les personnages</a>')
            .prependTo($dropdownChar)
            .on('click', Addon.putAllCharInSafeZone);

        $($tabMenu).find('a[href="/perso/infoPersonnage"]').remove();
        $($tabMenu).find('a[href="/perso/listePersonnage/"]').remove();

        $($tabMenu).on('click', function () {
            window.location.href = 'https://' + document.domain + '/perso/listePersonnage/';
        })
    },

    addBtnInstantHeal70: function () {
        const button = document.createElement('button');
        button.textContent = 'Heal 70%';
        button.className = 'btn btn-success mb-1';
        button.addEventListener('click', () => {
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
        });

        $('.zone1 .couleurBlack').after(button);
    },

    makeNavbarFixed: function () {
        $('nav.navbar').addClass('fixed-top');
    },

    checkUrl: function (match) {
        return Addon.currentUrl.indexOf(match) !== -1;
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
        alert('Erreur add-on JH #' + id + ':\n' + e);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.purple, 'Addon', ...args);
    },
};