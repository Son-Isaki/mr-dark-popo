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
    },

    OPTIONS_LABEL: {
        showTimerRefreshLife: 'Afficher un timer sur la navigation',
        customThemeEnabled: 'Activer le thème custom',

        showSafeZoneInActions: 'Ajouter un bouton rapide pour aller en safe zone',
        showShopInActions: 'Ajouter un bouton pour aller à la capsule corp ',
        showHealInActions: 'Ajouter un bouton pour se heal et retourner au combat',
        showFightTourInActions: 'Ajouter un bouton pour combattre rapidement la tour de combat',
        showFightZoneInActions: 'Ajouter un bouton pour aller en zone de combat',
        showTrainsInActions: 'Ajouter des boutons pour aller directement en entraînement',
    },

    MORE_OPTIONS: {

    },

    optionsChecked: 0,

    init: function () {
        this.displayOptionsPage();

        this.log('Initialized');
    },

    displayOptionsPage: function () {
        this.log('displayOptionsPage loaded', Addon.currentUrl, document.URL);
        if (!Addon.checkUrl('/?addOn')) {
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

        this.log(Utility.urlSafeZoneByPlanet);
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
            let $row = $('<div class="input-group mb-3"></div>');
            let $label = $('<input type="text" class="form-control" id="'+option+'-label" disabled/>');
            let $inputGroup = $('<div class="input-group-text"></div>');
            let $input = $('<input type="checkbox" class="checkbox-addon-options" checked data-toggle="toggle" id="'+option+'"> ');
            if ($this.MORE_OPTIONS[option]) {
                $input.attr('data-option', $this.MORE_OPTIONS[option]);
            }

            $label.val($this.OPTIONS_LABEL[id]);

            $row.append($label);
            $row.append($inputGroup);

            $inputGroup.append($input);

            $form.append($row);
        });
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
                            status = 'activé';
                            statusNotify = 'success';
                        } else {
                            status = 'désactivé';
                            statusNotify = 'warning';
                        }

                        Notify.notify("L'option <span class=\"text-orange\">"+$('#'+option+'-label').val()+"</span> a été "+status, statusNotify);

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

            $input.prop('checked', value === 'true');
        })
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.blue, 'Options', ...args);
    },
}