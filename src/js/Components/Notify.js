const Notify = window.Notify = {

    addSelector: '.btn-add-bonus',
    subSelector: '.btn-remove-bonus',
    disabledClass: 'readonly',
    duration: 2000,

    init: function () {
        const $this = this;

        $.notifyDefaults({
            type: 'info',
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 20,
                y: 80,
            },
            delay: $this.duration,
            timer: 1000,
            animate: {
                enter: '',
                exit: ''
            },
            z_index: 99996,
            template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">x</button>' +
                // '<span data-notify="icon"></span> ' +
                // '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                // '<div class="progress" data-notify="progressbar">' +
                // '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                // '</div>' +
                // '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>',
        });

        $this.log("Initialized");
    },

    notify: function (message, type) {
        const $this = this;

        if (type === undefined) {
            type = 'info';
        }

        // create notification
        let notity = $.notify({
            message: message,
        }, {
            type: type,
        });

        // handle animations
        setTimeout(function () {
            notity.$ele.addClass('fadeIn');
        }, 10);
        setTimeout(function () {
            notity.$ele
                .removeClass('fadeIn')
                .addClass('fadeOut');
        }, $this.duration);

        $this.log(message);
    },

    log: function (...args) {
        Logger.log(Logger.COLORS.yellow, 'Notify', ...args);
    },

};