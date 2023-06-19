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
        fixInfoPlayerOnScroll: 'fix-info-player-on-scroll',
        customAvatar: 'custom-avatar',
        sendAlertLowLife: 'send-alert-character-low-life',
        systemGestionCharacter: 'system-gestion-character',
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
        customAvatar: 'Pouvoir utiliser des avatar customs',
        fixInfoPlayerOnScroll: 'Fixer les infos du joueur/personnage lors du scroll',
        sendAlertLowLife: 'Recevoir des alertes quand un personnage n\'a presque plus de vie',
        systemGestionCharacter: 'Ajouter un système pour "gérer" ses personnages (kaioh/verte/stuff)',
    },

    MORE_OPTIONS: {
        'show-trains-actions': {
            label: 'Sélectionner les trains à afficher',
            type: 'checkbox',
            data: [
                {
                    label: 'Entraînement attaque',
                    option: 'show-train-attaque-actions'
                },
                {
                    label: 'Entraînement défense',
                    option: 'show-train-defense-actions'
                },
                {
                    label: 'Entraînement magie',
                    option: 'show-train-magie-actions'
                },
            ]
        }
    },

    SETTINGS: [
        'show-train-attaque-actions',
        'show-train-defense-actions',
        'show-train-magie-actions',
    ],

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
        this.buildBlockSettings();
        this.setEventField();
        this.setValueForm();
    },

    showOptions: function () {
        const $this = this;

        let $form = $('<form id="options-available"></form>');
        let $container = $('#zoneBoss2');

        $container.addClass('containerOptionsAddOn').append($form);

        $.each($this.OPTIONS, (id, option)=> {
            let $row = $('<div class="input-group"></div>');
            let $label = $('<label class="form-control" id="'+option+'-label" for="'+option+'"></label>');
            let $inputGroup = $('<div class="input-group-text"></div>');
            let $input = $('<input type="checkbox" class="checkbox-addon-options" data-toggle="toggle" id="'+option+'"> ');
            if ($this.MORE_OPTIONS[option]) {
                $input.attr('data-option', option);
            }

            $label.html($this.OPTIONS_LABEL[id]);

            $row.append($label);
            $row.append($inputGroup);

            $inputGroup.append($input);

            $form.append($row);

            if ($this[id] !== undefined) {
                Events.register(option, () => {
                    $this[id]();
                })
            }
        });
    },

    buildBlockSettings: function () {
        const $this = this;
        let $container = $('.containerOptionsAddOn');
        let $section = $('<section class="containerSettingsAddOn"></section>');
        let $title = $('<h2>Saisie des paramètres des options</h2>').appendTo($section);

        let $form = $('<form id="settings-input"></form>');

        $.each($this.MORE_OPTIONS, (key, data) => {
            let $currentRow = $('<fieldset data-option-id="'+key+'" style="display:none;"></div>');
            let $label = $('<legend>'+data.label+'</legend>').appendTo($currentRow);

            switch (data.type) {
                default:
                    break;

                case "checkbox":
                    $.each(data.data, (key, item) => {
                        let $tmpRow = $('<div class="form-check form-check-inline"></div>');
                        let checkboxLabel = $('<label class="form-check-label" for="'+item.option+'">'+item.label+'</label>');
                        let checkbox = $('<input class="form-check-input" type="checkbox" name="'+item.option+'" id="'+item.option+'" />');

                        $tmpRow.append(checkbox);
                        $tmpRow.append(checkboxLabel);
                        $currentRow.append($tmpRow);
                    });
                    break;
            }


            $form.append($currentRow);
        });

        // Create submit button
        let $submitButton = Utility.createSubmitButton('Mettre à jour les settings');
        $form.append($submitButton);

        $section.append($form);
        $container.after($section);

        $form.submit( (e) => {
            e.preventDefault();
            $this.updateSettings();
        });
    },

    showTimerRefreshLife: function () {
        Addon.showTimerRefreshLife();
    },

    customThemeEnabled: function () {
        Theme.init();
    },

    updateSettings: function () {
        const $this = this;

        $($this.SETTINGS).each((key, option) => {
            let $input = $('#'+option);
            let $inputVal = 'false';

            switch ($input.attr('type')) {
                default:
                    break;

                case "checkbox":
                    $inputVal = $input.prop('checked') ? 'true' : 'false';
                    break;
            }

            LocalStorage.set(option, $inputVal)
        });

        Notify.notify('Paramètres des options de l\'addon mis à jour.', 'success');
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

                        Events.trigger(option);

                        Notify.notify("L'option <span>" + $('#' + option + '-label').html() + "</span> a été "+status, statusNotify);
                        $this.toggleOptions($input);
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
            let $setting = $this.MORE_OPTIONS[option];
            let isChecked = value === 'true'


            $input.prop('checked', isChecked);

            if ($setting) {
                if (isChecked) {
                    $this.optionsChecked++;
                }
                $this.toggleOptions($input);
            }
        })

        $.each($this.SETTINGS, (key, option) => {
            let storageValue = LocalStorage.get(option, 'false');
            let $input = $('#'+option);

            if ($input)
                $input.prop('checked', storageValue === 'true');
        });
    },

    toggleOptions: function(input) {
        const $this = this;

        if (!input) {
            return false;
        }

        let block = $('.containerSettingsAddOn');
        let idSettings = $(input).data('option') ?? $(input).attr('id');

        if (Options.optionsChecked > 0) {
            block.show();
            $('.option-submit').show();

            let $setting = $this.MORE_OPTIONS[idSettings];

            if ($setting) {
                let $group = $('fieldset[data-option-id="'+idSettings+'"');
                let countSameElementDisplayed = $('input[data-option="'+idSettings+'"]:checked').length;

                if ($group.length > 1) {
                    $.each($group, (key, element) => {
                        let style = $(element).css('display');

                        if (style === 'none') {
                            $(element).css('display', 'flex');
                        } else {
                            if (countSameElementDisplayed === 0)
                                $(element).hide();
                        }
                    });
                } else {
                    if (countSameElementDisplayed >= 1)
                        $group.show();
                    else
                        $group.hide();
                }
            }

        } else {
            $('#settings div.input-group').each(function() {
                if ($(this).css('display') === 'flex') {
                    $(this).css('display', 'none');
                }
            })
            $('.option-submit').hide();
            block.hide();
        }

        let divElement = $('div[data-option="'+idSettings+'"');
        divElement.toggle('display');
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.blue, 'Options', ...args);
    },
}