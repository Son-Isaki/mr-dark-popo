document.addEventListener("DOMContentLoaded", function() {
    function slugify(str)
    {
        str = str.replace(/^\s+|\s+$/g, '');

        // Make the string lowercase
        str = str.toLowerCase();

        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        // Remove invalid chars
        str = str.replace(/[^a-z0-9 ]/g, '')
            // Collapse whitespace and replace by -
            .replace(/\s+/g, '-')
            // Collapse dashes
            .replace(/-+/g, '-');

        return str;
    }

    var browser = browser || chrome;

    function getKeyFromValue(array, value) {
        for(var key in array){
            if(array[key] === value){
                return key;
            }
        }
        return null;
    }

    var options = {
        browser: '',
        fields: {},
        optionsChecked: 0,
        translateField: {
            'replaceBtnSelectFighter':      'addon_replace_btn_select_fighter',
            'autoDialogAdventure':          'addon_auto_dialog_adventure',
            'autoFightAdventure':           'addon_auto_fight_adventure',
            'autoRetryAdventure':           'addon_auto_retry_adventure',
            'showAllAvatars':               'addon_show_all_avatars',
            'addBtnAcceptAllFight':         'addon_add_btn_accept_all_fight',
            // 'autoFight':                    'addon_auto_fight',
            'removeLighterEffect':          'addon_remove_lighter_effect',
            'knowCcE':                      'addon_know_cc_e',
            'addBtnAcceptSpecificFight':    'addon_add_btn_accept_specific_fight',
            'timerFight':                   'addon_timer_fight',
            'definedCombo':                 'addon_use_defined_combo',
            'definedComboCharacter':        'addon_use_defined_combo_character',
            'relaunchWork':                 'addon_relaunch_work',
            'hasLicense':                   'hasLicense',
            'characterWorkBeef':            'charactersForBeef',
            'characterWorkSenzu':           'charactersForSenzu',
            'characterWorkMilk':            'charactersForMilk',
            'characterWorkFish':            'charactersForFish',
            'marketCharacter':              'addon_market_character',
            'marketPrice':                  'addon_market_price',
            'buyMultipleCaps':              'addon_buy_multiple_caps',
        },

        init: function(browser) {
            this.browser = browser;
        },

        setAllField: function() {
            this.fields.replaceBtnSelectFighter     = {'addon_replace_btn_select_fighter': $('#addon_replace_btn_select_fighter')};
            this.fields.autoDialogAdventure         = {'addon_auto_dialog_adventure': $('#addon_auto_dialog_adventure')};
            this.fields.autoFightAdventure          = {'addon_auto_fight_adventure': $('#addon_auto_fight_adventure')};
            this.fields.autoRetryAdventure          = {'addon_auto_retry_adventure': $('#addon_auto_retry_adventure')};
            this.fields.showAllAvatars              = {'addon_show_all_avatars': $('#addon_show_all_avatars')};
            this.fields.addBtnAcceptAllFight        = {'addon_add_btn_accept_all_fight': $('#addon_add_btn_accept_all_fight')};
            // blackList                   = $('#addon_blacklist');
            // this.fields.autoFight                   = {'addon_auto_fight': $('#addon_auto_fight')};
            this.fields.removeLighterEffect         = {'addon_remove_lighter_effect': $('#addon_remove_lighter_effect')};
            this.fields.knowCcE                     = {'addon_know_cc_e': $('#addon_know_cc_e')};
            this.fields.addBtnAcceptSpecificFight   = {'addon_add_btn_accept_specific_fight': $('#addon_add_btn_accept_specific_fight')};
            this.fields.timerFight                  = {'addon_timer_fight': $('#addon_timer_fight')};
            this.fields.definedCombo                = {'addon_use_defined_combo': $('#addon_use_defined_combo')};
            this.fields.definedComboCharacter       = {'addon_use_defined_combo_character': $('#addon_use_defined_combo_character')};
            this.fields.relaunchWork                = {'addon_relaunch_work': $('#addon_relaunch_work')};
            this.fields.hasLicense                  = {'hasLicense': $('#workLicense')};
            this.fields.buyMultipleCaps             = {'addon_buy_multiple_caps': $('#addon_buy_multiple_caps')};

            this.fields.characterWorkBeef           = {'charactersForBeef': $('#addon_characters_for_work_beef')};
            this.fields.characterWorkSenzu          = {'charactersForSenzu': $('#addon_characters_for_work_senzu')};
            this.fields.characterWorkMilk           = {'charactersForMilk': $('#addon_characters_for_work_milk')};
            this.fields.characterWorkFish           = {'charactersForFish': $('#addon_characters_for_work_fish')};
            // this.fields.marketCharacter             = {'addon_market_character': $('#addon_market_character')};
            // this.fields.marketPrice                 = {'addon_market_price': $('#addon_market_price')};

            this.setLabelField();
            this.setEventField();
            this.setOptionsSelectField();
        },

        setLabelField: function() {
            $('#addon_replace_btn_select_fighter-label')    .html(chrome.i18n.getMessage('replaceBtnSelectFighter'));
            $('#addon_auto_dialog_adventure-label')         .html(chrome.i18n.getMessage('autoDialogAdventure'));
            $('#addon_auto_fight_adventure-label')          .html(chrome.i18n.getMessage('autoFightAdventure'));
            $('#addon_auto_retry_adventure-label')          .html(chrome.i18n.getMessage('autoRetryAdventure'));
            $('#addon_show_all_avatars-label')              .html(chrome.i18n.getMessage('showAllAvatars'));
            $('#addon_add_btn_accept_all_fight-label')      .html(chrome.i18n.getMessage('addBtnAcceptAllFight'));
            // $('#addon_blacklist-label').html(chrome.i18n.getMessage('blackList'));
            // $('#addon_auto_fight-label')                    .html(chrome.i18n.getMessage('autoFight'));
            $('#addon_remove_lighter_effect-label')         .html(chrome.i18n.getMessage('removeLighterEffect'));
            $('#addon_know_cc_e-label')                     .html(chrome.i18n.getMessage('knowCcE'));
            $('#addon_add_btn_accept_specific_fight-label') .html(chrome.i18n.getMessage('addBtnAcceptSpecificFight'));
            $('#addon_relaunch_work-label')                 .html(chrome.i18n.getMessage('relaunchWork'));
            $('#addon_auto_buy_legendary_in_market-label')  .html(chrome.i18n.getMessage('autoBuyLegendaryInMarket'));
            $('#addon_buy_multiple_caps-label')             .html(chrome.i18n.getMessage('buyMultipleCaps'));
        },

        setEventField: function() {
            let inputIdForOptions = {
                'addon_add_btn_accept_all_fight' : 'addon_timer_fight',
                'addon_add_btn_accept_specific_fight': 'addon_timer_fight',
                'addon_auto_buy_legendary_in_market': 'addon_market',
            };

            $.each(this.fields, function(key, data) {
                $.each(data, function(variable, field) {
                    let fieldType = $(field).attr('type');
                    $(field).on('change', function(){
                        if (fieldType === 'checkbox') {
                            let value = $(this).prop('checked') ? "true" : "false";

                            if (inputIdForOptions[$(this).attr('id')]) {
                                if (value === "true")
                                    options.optionsChecked++;
                                else
                                    options.optionsChecked--;
                            }

                            chrome.storage.local.set({[variable]: value})

                            options.toggleOptions(this);
                        } else if (fieldType === 'number') {
                            console.log('number');
                            console.log($(this).value);
                        } else {
                            if (variable === 'hasLicense') {
                                options.setMultipleSelectForm($(field).val());
                            }
                        }
                    })
                });
            });

            this.setValueForm();
            this.setEventForm();
        },

        setMultipleSelectForm: function(value) {
            chrome.storage.local.set({'hasLicense': value});
            let selects = $('#settings-work select.chars');
            if (value === "true") {
                selects.each(function() {
                    console.log($(this));
                    $(this).attr('multiple', 'multiple');
                    $(this).change(function () {
                        maxAllowedMultiselect(this, 2);
                    });
                });
            } else {
                selects.each(function() {
                    $(this).removeAttr('multiple');
                    $(this).off('change');
                })
            }
        },

        setOptionsSelectField: function() {
            $('select.select-characters').each(function() {
                let currentSelect = $(this);

                characters.sort();

                $.each(characters, function(id, character) {
                    let option = document.createElement('option');
                    option.value = slugify(character);
                    option.innerHTML = character;
                    option.setAttribute('data-character', character);

                    if ($('body').find('option[data-character="'+character+'"]').length > 1) {
                        $(currentSelect).append(option.cloneNode(true));
                    } else {
                        $(currentSelect).append(option);
                    }
                })
            })
        },

        setValueForm: function() {
            chrome.storage.local.get([
                "addon_replace_btn_select_fighter",
                "addon_auto_dialog_adventure",
                "addon_auto_fight_adventure",
                "addon_auto_retry_adventure",
                "addon_show_all_avatars",
                "addon_add_btn_accept_all_fight",
                // "addon_blacklist",
                // "addon_auto_fight",
                "addon_remove_lighter_effect",
                "addon_know_cc_e",
                "addon_add_btn_accept_specific_fight",
                "addon_timer_fight",
                "addon_use_defined_combo",
                "addon_use_defined_combo_character",
                "addon_relaunch_work",
                "hasLicense",
                "charactersForBeef",
                "charactersForSenzu",
                "charactersForMilk",
                "charactersForFish",
                "addon_buy_multiple_caps"
            ], function (result) {
                let inputIdForOptions = {
                    'addon_add_btn_accept_all_fight' : 'addon_timer_fight',
                    'addon_add_btn_accept_specific_fight': 'addon_timer_fight',
                    'addon_auto_buy_legendary_in_market': 'addon_market',
                };

                $.each(result, function(option, value) {
                    let key = getKeyFromValue(options.translateField, option);
                    let field = $(options.fields[key][option]);
                    let fieldType = field.attr('type');

                    if (fieldType === 'checkbox') {
                        if (value === "true") {
                            field.prop('checked', value === "true");
                            if (inputIdForOptions[field.id ?? $(field).attr('id')]) {
                                options.optionsChecked++;
                            }
                            options.toggleOptions(field);
                        }
                    } else {
                        if (option === 'hasLicense') {
                            options.setMultipleSelectForm(value);
                            field.val(value);
                        } else {
                            setTimeout(function() {
                                $(field).val(value);
                            }, 100);
                        }
                    }
                });
            });
        },

        setEventForm: function() {
            $('#formCharactersForWork').submit(function(e) {
                e.preventDefault();

                let selectCharsBeef  = $('#addon_characters_for_work_beef').val(),
                    selectCharsSenzu = $('#addon_characters_for_work_senzu').val(),
                    selectCharsMilk  = $('#addon_characters_for_work_milk').val(),
                    selectCharsFish  = $('#addon_characters_for_work_fish').val();

                chrome.storage.local.set({
                    'charactersForBeef':  selectCharsBeef,
                    'charactersForSenzu': selectCharsSenzu,
                    'charactersForMilk':  selectCharsMilk,
                    'charactersForFish':  selectCharsFish
                })

                console.log(selectCharsBeef, selectCharsFish, selectCharsMilk, selectCharsSenzu);
            })

            $('#submit-setting').on('click', function(e) {
                e.preventDefault();

                let settingTimerFight = document.getElementById('addon_timer_fight');
                if (settingTimerFight.value) {
                    chrome.storage.local.set({'addon_timer_fight': settingTimerFight.value});
                }

                let settingDefinedCombo = document.getElementById('addon_use_defined_combo');
                let settingDefinedComboCharacter = document.getElementById('addon_use_defined_combo_character');
                if (settingDefinedCombo.value && settingDefinedComboCharacter.value) {
                    let keyName = 'addon_use_defined_combo_for_'+settingDefinedComboCharacter.value;
                    chrome.storage.local.set({[keyName]: settingDefinedCombo.value});
                }
            })
        },

        // toggleOptions: function(input) {
        //     let inputId = input.id ?? $(input).attr('id');
        //
        //     let inputIdForOptions = {
        //         'addon_add_btn_accept_all_fight' : 'addon_timer_fight',
        //         'addon_add_btn_accept_specific_fight': 'addon_timer_fight',
        //         'addon_auto_buy_legendary_in_market': 'addon_market',
        //     };
        //
        //     let settingsElement = $('#settings');
        //
        //     if (options.optionsChecked > 0) {
        //         settingsElement.show();
        //         $('.option-submit').show();
        //         if (inputIdForOptions[inputId]) {
        //             let $group = $('div[data-option-id="'+inputIdForOptions[inputId]+'"');
        //             let countSameElementDisplayed = $('input[data-option="timer-fight"]:checked').length;
        //
        //
        //             if ($group.length > 1) {
        //                 $.each($group, function(key, element) {
        //                     let style = $(element).css('display');
        //
        //                     if (style === 'none') {
        //                         $(element).css('display', 'flex');
        //                     } else {
        //                         if (countSameElementDisplayed === 0 || inputIdForOptions[inputId] !== "addon_timer_fight")
        //                             $(element).hide();
        //                     }
        //                 })
        //             } else {
        //                 let style = $($group).css('display');
        //                 if (style === 'none') {
        //                     $($group).css('display', 'flex');
        //                 } else {
        //                     $($group).hide();
        //                 }
        //             }
        //         }
        //     } else {
        //         $('#settings div.input-group').each(function() {
        //             if ($(this).css('display') === 'flex') {
        //                 $(this).css('display', 'none');
        //             }
        //         })
        //         $('.option-submit').hide();
        //         settingsElement.hide();
        //     }
        //
        //     let divElement = $('div[data-option="'+inputId+'"');
        //     divElement.toggle('display');
        // },
    };

    options.init(browser);

    function reloadTab()
    {
        browser.tabs.reload();
    }
})