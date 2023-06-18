const InventoryPage = window.InventoryPage = {

    init: function () {
        const $this = this;

        $('<h2>Inventaire</h2>')
            .prependTo($('.zone2'));

        let $itemsContainer = $('#zoneObjets');
        let $buttonsContainer = $('.zoneBoutonsInventaire');

        Utility.createFilter("Tout", 'all', true, $buttonsContainer)
            .on('change', function () {
                let $buttons = $('.zoneBoutonsInventaire input:not(.all)')
                $buttons.prop('checked', $(this).prop('checked'));
                $this.filterInventory()
            });

        $('.boutonObjets').each(function () {
            let $button = $(this);
            let typeName = Utility.trim($button.text());
            let type = Utility.slugify(typeName);

            $button.remove();

            Utility.createFilter(typeName, type, true, $buttonsContainer)
                .on('change', function () {
                    let $buttons = $('.zoneBoutonsInventaire input:not(.all)');
                    let $buttonsChecked = $buttons.filter(':checked');
                    let $buttonAll = $('.zoneBoutonsInventaire input.all');

                    $buttonAll.prop('checked', $buttonsChecked.length === $buttons.length);

                    $this.filterInventory();
                });

            let url = new URL('https://' + document.domain + '/inventaire/filter')
            url.search = new URLSearchParams({
                type: typeName,
            }).toString();

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                },
                mode: "cors",
                credentials: "same-origin",
            })
                .then(response => response.text())
                .then((response) => {

                    let $items = $(response).find('.ecartObjets');

                    $items.each(function () {
                        let $img = $(this);

                        let $item = $('<div class="item">')
                            .attr('data-type', type)
                            .append($img)
                            .appendTo($itemsContainer);

                        let $infos = $('<div class="infos">')
                            .appendTo($item);

                        let title = $img.attr('data-name');
                        let $title = $('<span class="title">')
                            .text(title)
                            .appendTo($infos);

                        $('<span class="type">')
                            .text(typeName)
                            .appendTo($infos)
                    });

                    // sort by name
                    $itemsContainer.find('.item').detach().sort((a, b) => {
                        a = $(a).find('.title').text();
                        b = $(b).find('.title').text();
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    }).appendTo($itemsContainer);

                });
        });

        $this.log("Initialized");

    },

    filterInventory: function () {
        let $buttons = $('.zoneBoutonsInventaire input:not(.all)');
        let $buttonsChecked = $buttons.filter(':checked');

        let types = [];
        $buttonsChecked.each(function () {
            types.push($(this).attr('data-type'));
        });

        $('#zoneObjets').find('.item').each(function () {
            if (types.includes($(this).attr('data-type'))) {
                $(this).removeClass('is-hidden');
            } else {
                $(this).addClass('is-hidden');
            }
        });
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.deeppurple, 'InventoryPage', ...args);
    },

};