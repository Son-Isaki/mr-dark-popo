const Logger = window.Logger = {


    // variables

    // Couleurs material palette : https://www.materialpalette.com/colors
    COLORS: {
        red: {background: "#f44336", foreground: "white"},
        pink: {background: "#e91e63", foreground: "white"},
        purple: {background: "#9c27b0", foreground: "white"},
        deeppurple: {background: "#673ab7", foreground: "white"},
        indigo: {background: "#3f51b5", foreground: "white"},
        blue: {background: "#2196f3", foreground: "white"},
        lightblue: {background: "#03a9f4", foreground: "white"},
        cyan: {background: "#00bcd4", foreground: "white"},
        teal: {background: "#009688", foreground: "white"},
        green: {background: "#4caf50", foreground: "white"},
        lightgreen: {background: "#8bc34a", foreground: "black"},
        lime: {background: "#cddc39", foreground: "black"},
        yellow: {background: "#ffeb3b", foreground: "black"},
        amber: {background: "#ffc107", foreground: "black"},
        orange: {background: "#ff9800", foreground: "white"},
        deeporange: {background: "#ff5722", foreground: "white"},
        brown: {background: "#795548", foreground: "white"},
        gray: {background: "#9e9e9e", foreground: "white"},
        bluegray: {background: "#607d8b", foreground: "white"},
    },

    RESET: "\x1b[0m",

    init: function () {

    },

    test: function () {
        const $this = this;

        let lorem = "I'm baby blackbird spyplane gorpcore cold-pressed post-ironic";

        $this.log($this.COLORS.red, 'red', lorem);
        $this.log($this.COLORS.pink, 'pink', lorem);
        $this.log($this.COLORS.purple, 'purple', lorem);
        $this.log($this.COLORS.deeppurple, 'deeppurple', lorem);
        $this.log($this.COLORS.indigo, 'indigo', lorem);
        $this.log($this.COLORS.blue, 'blue', lorem);
        $this.log($this.COLORS.lightblue, 'lightblue', lorem);
        $this.log($this.COLORS.cyan, 'cyan', lorem);
        $this.log($this.COLORS.teal, 'teal', lorem);
        $this.log($this.COLORS.green, 'green', lorem);
        $this.log($this.COLORS.lightgreen, 'lightgreen', lorem);
        $this.log($this.COLORS.lime, 'lime', lorem);
        $this.log($this.COLORS.yellow, 'yellow', lorem);
        $this.log($this.COLORS.amber, 'amber', lorem);
        $this.log($this.COLORS.orange, 'orange', lorem);
        $this.log($this.COLORS.deeporange, 'deeporange', lorem);
        $this.log($this.COLORS.brown, 'brown', lorem);
        $this.log($this.COLORS.gray, 'gray', lorem);
        $this.log($this.COLORS.bluegray, 'bluegray', lorem);
    },

    log: function (color, title, ...args) {
        const $this = this;
        if (Addon.debug) {
            let style = `background-color: ${color.background}; color:${color.foreground}; font-weight: bold; padding:2px 5px; border-radius:2px;`;
            console.log(`%c%s${$this.RESET}`, style, title, ...args);
        }
    },
};