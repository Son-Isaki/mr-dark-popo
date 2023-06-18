const Options = window.Options = {
    // variables
    OPTIONS: {
        showTimerRefreshLife: 'show-timer-refresh-life',
        customThemeEnabled: 'custom-theme-enabled',

        showSafeZoneInActions: 'show-safezone-actions',
        showShopInActions: 'show-shop-actions',
        showHealInActions: 'show-heal-actions',
        showFightTourInActions: 'show-fight-tour-actions',
        showFightZoneInActions: 'show-fight-zone-actions',
        showTrainsInActions: 'show-trains-actions',
        showBonusCharacterPoints: 'show-bonus-character-points',

        reverseInfoPlayer: 'reverse-info-player',
        showHistoryModeOnMap: 'show-history-mode-on-map',
        validLinkHistoryMode: 'valid-link-history-on-map',
        btnDisplayAllChars: 'btn-display-all-char',
        btnAddRemoveAllBonusPoints: 'btn-add-remove-bonus-points',

        ajaxFight: 'ajax-fight',
        autoFightForm: 'auto-fight-form',

        showLinkMoveAllChars: 'show-link-move-all-chars',
        changeCharacterColorUnavailable: 'change-character-color-unavailable',
        removeLinkInfoPerso: 'remove-link-info-perso',

        fixNavbarTop: 'fix-navbar-top',
    },

    OPTIONS_LABEL: {
        showTimerRefreshLife: 'Afficher un timer sur la navigation',
        customThemeEnabled: 'Activer le thème custom',

        showSafeZoneInActions: 'Ajouter un bouton d\'action rapide pour aller en safe zone',
        showShopInActions: 'Ajouter un bouton d\'action rapide pour aller à la capsule corp ',
        showHealInActions: 'Ajouter un bouton d\'action rapide pour se heal et retourner au combat',
        showFightTourInActions: 'Ajouter un bouton d\'action rapide pour combattre rapidement la tour de combat',
        showFightZoneInActions: 'Ajouter un bouton d\'action rapide pour aller en zone de combat',
        showTrainsInActions: 'Ajouter des boutons d\'action rapide pour aller directement en entraînement',
        showBonusCharacterPoints: 'Afficher un lien rapide d\'ajout de points bonus en dessous de l\'avatar du personnage',
        reverseInfoPlayer: 'Inverser la position du block d\'information du joueur/personnage',
        showHistoryModeOnMap: 'Ajouter un block des modes histoire directement sur la map',
        validLinkHistoryMode: 'Ajouter un lien pour valider directement l\'étape en cours (nécessite d\'avoir le bon personnage en cours)',
        btnDisplayAllChars: 'Ajouter un bouton pour masquer/afficher tous les personnages dans la page vos personnages',
        btnAddRemoveAllBonusPoints: 'Ajouter des boutons tout enlever/mettre ses points de caractéristiques',
        ajaxFight: 'Modifier le système de combat pour un système de combat plus confort',
        autoFightForm: 'Ajouter un système de combat "automatique" avec certains critères',
        showLinkMoveAllChars: 'Ajouter un lien sortir/rentrer tous ses personnages favoris',
        changeCharacterColorUnavailable: 'Changer la couleur des personnages favoris indisponible',
        removeLinkInfoPerso: 'Retirer le lien Info Persos dans le menu Personnages',
        fixNavbarTop: 'Fixer la barre de navigation en haut',
    },

    MORE_OPTIONS: {

    },

    optionsChecked: 0,

    init: function () {
        this.log('Initialized');
        this.displayOptionsPage();
    },

    initOptions: function () {
        const $this = this;

        $.each($this.OPTIONS, (key, option) => {
            let value = LocalStorage.get(option, 'false');

            LocalStorage.set(option, value);
        });
    },

    displayOptionsPage: function () {
        if (!Addon.checkUrl('addOn')) {
            return false;
        }

        let $characterContainer = $('#zoneDuPersonnage');
        $characterContainer.remove();


        let $container = $('#zoneBoss2');
        $container.html('');

        $('.zone2').attr('class', 'zone2 col-md-12')
        $('.infoPersoProfilPublic').remove();

        let $title = $('<h2>Gestion des options de l\'Addon</h2>');
        $container.append($title);

        this.showOptions();
        this.setEventField();
        this.setValueForm();
    },

    showOptions: function () {
        const $this = this;

        let $form = $('<form id="options-available"></form>');
        let $container = $('#zoneBoss2');

        $container.addClass('containerOptionsAddOn').append($form);

        $this.log('options list', $this.OPTIONS);

        $.each($this.OPTIONS, (id, option)=> {
            $this.log('loop', id, option);
            let $row = $('<div class="input-group"></div>');
            let $label = $('<label class="form-control" id="'+option+'-label" for="'+option+'"></label>');
            let $inputGroup = $('<div class="input-group-text"></div>');
            let $input = $('<input type="checkbox" class="checkbox-addon-options" data-toggle="toggle" id="'+option+'"> ');
            if ($this.MORE_OPTIONS[option]) {
                $input.attr('data-option', $this.MORE_OPTIONS[option]);
            }

            $label.html($this.OPTIONS_LABEL[id]);

            $row.append($label);
            $row.append($inputGroup);

            $inputGroup.append($input);

            $form.append($row);

            $this.log('register an event', $this.OPTIONS[option]);
            if ($this[id] !== undefined) {
                Events.register(option, () => {
                    $this[id]();
                })
            }
        });
    },

    showTimerRefreshLife: function() {
        Addon.showTimerRefreshLife();
    },

    customThemeEnabled: function() {
        Theme.init();
    },

    setEventField: function () {
        const $this = this;
        $.each($this.OPTIONS, (id, option) => {
            let $label = $('label[for="'+option+'"]');
            let $input = $('#'+option);

            $input.on('change', () => {
                let $fieldType = $input.attr('type');

                switch ($fieldType) {
                    default:
                        break;

                    case "checkbox":
                        let value = $input.prop('checked') ? 'true' : 'false';
                        $this.log('checkboxxxx this', this);
                        if (Options.MORE_OPTIONS[option]) {
                            if (value === "true") {
                                Options.optionsChecked++;
                            } else {
                                Options.optionsChecked--;
                            }
                        }

                        LocalStorage.set(option, value);

                        let status, statusNotify;

                        if (value === "true") {
                            status = 'activée';
                            statusNotify = 'success';
                        } else {
                            status = 'désactivée';
                            statusNotify = 'warning';
                        }

                        $this.log('try to trigger an event', option);
                        Events.trigger(option);

                        Notify.notify("L'option <span>" + $('#' + option + '-label').html() + "</span> a été "+status, statusNotify);

                        break;
                }
            });
        });
    },

    setValueForm:  function (){
        const $this = this;

        $.each($this.OPTIONS, (key, option) => {
            let $input = $('#'+option);
            let value = LocalStorage.get(option, 'false');

            $this.log('setValueForm', key, option, value, $input);

            $input.prop('checked', value === 'true');
        })
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.blue, 'Options', ...args);
    },
}