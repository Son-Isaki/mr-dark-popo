class Character {

    slug = '';
    name = '';
    level = 0;

    avatar = '';
    isCustomAvatar = false;
    thumbnail = '';
    isCustomThumbnail = false;

    lifeCurrent = 0;
    lifeMax = 0;

    experienceCurrent = 0;
    experienceMax = 0;

    clanName = '';
    clanSlug = '';

    trainDate = null;

    zenis = 0;

    energyAtk = 0;
    energyDef = 0;
    energyMag = 0;
    energyAcc = 0;
    energyExt = 0;

    // liens
    linkSelect = '';

    constructor(content) {
        this.getDataFromHtml(content);
        this.getProgressDataFromHtml(content)
    }

    getLifePercent() {
        return (this.lifeCurrent / this.lifeMax * 100);
    }

    getExperiencePercent() {
        return (this.experienceCurrent / this.experienceMax * 100);
    }

    /**
     * Récupère les infos perso à partir d'une chaine HTML
     *
     * @param content
     */
    getDataFromHtml(content) {
        const $this = this;

        if (typeof content === 'undefined') {
            return;
        }

        let $content = $(content);

        let isPageInfosPerso = $content.find('.zoneTextePersoInfoAvatar').length;
        let isBlocInfosPerso = $content.find('.imgPersoActuelDiv').length;
        let isPageListPersos = $content.find('h5 .etoileGris').length;

        if (isPageInfosPerso || isBlocInfosPerso) {
            this.clanName = $content.find('.couleurRouge').text().replace('[', '').replace(']', '');
            this.clanSlug = Utility.slugify(this.clanName);
        }

        this.avatar = $content.find('.imgPersoActuel, .tailleImageListePerso').attr('src');
        this.linkSelect = $content.find('.imgPersoActuel, .tailleImageListePerso').parents('a').attr('href');

        if (isPageInfosPerso || isBlocInfosPerso) {
            this.zenis = parseInt($content.find('table.centerTexte tr').eq(0).text());
            this.energyAtk = parseInt($content.find('table.centerTexte tr').eq(1).text());
            this.energyDef = parseInt($content.find('table.centerTexte tr').eq(2).text());
            this.energyMag = parseInt($content.find('table.centerTexte tr').eq(3).text());
            this.energyAcc = parseInt($content.find('table.centerTexte tr').eq(4).text());
            this.energyExt = parseInt($content.find('table.centerTexte tr').eq(5).text());
        }

        if (isPageInfosPerso) {

            this.name = Utility.trim($content.find('.zoneTextePersoInfoAvatar h3').text())
            this.slug = Utility.slugify(this.name);
            this.level = parseInt(Utility.trim($content.find('.zoneTextePersoInfoAvatar h3 + p').text()).split(' ')[1]);

        } else if (isBlocInfosPerso) {

            let tmp = $content.find('.imgPersoActuelDiv')[0];
            let lst = [];
            for (let i = 0; i < tmp.childNodes.length; i++) {
                if (tmp.childNodes[i].nodeType === Node.TEXT_NODE) {
                    let text = Utility.trim(tmp.childNodes[i].nodeValue);
                    if (text !== '') {
                        lst.push(text);
                    }
                    tmp.childNodes[i].remove()
                }
            }

            // name & slug
            this.name = lst[0];
            this.slug = Utility.slugify(this.name)

            // level
            if (lst[1] !== undefined && lst[1] !== '') {
                this.level = parseInt(lst[1].split(' ')[1]);
            }
        } else if (isPageListPersos) {
            this.name = Utility.trim($content.find('h5').text());
            this.slug = Utility.slugify(this.name);

            this.level = parseInt(Utility.trim($content.find('h5 + table').text()).split(' ')[1]);

            if ($content.find('progress:last-of-type + table').length) {
                let segs = Utility.trim($content.find('progress:last-of-type + table').text()).split(' ');
                let year = segs[3].split('/');
                let str = `${year[2]}-${year[1]}-${year[0]} ${segs[5]}`;
                this.trainDate = new Date(str);}
        }
    }

    /**
     * Parse une chaine HTML afin de retourner les données des barres de vie et d'expérience
     *
     * @param content
     */
    getProgressDataFromHtml(content) {
        const $this = this;

        // life
        $(content).find('#filePV').each(function () {
            let $el = $(this);
            let $parent;

            // infos perso // liste de persos
            $parent = $el.parents('.zone1sub, .cadrePersoList');
            if ($parent.length > 0) {
                $this.lifeCurrent = parseInt($el.attr('value'));
                $this.lifeMax = parseInt($el.attr('max'));
            }
        });

        // experience
        $(content).find('#file').each(function () {
            let $el = $(this);
            let $parent;

            // infos perso
            $parent = $el.parents('.zone1sub, .cadrePersoList');
            if ($parent.length > 0) {
                let levelObj = Database.levels[$this.level];
                let levelObjSub = Database.levels[$this.level - 1];
                if (typeof levelObjSub === 'undefined') {
                    levelObjSub = {
                        level: 0,
                        experience: 0,
                    }
                }

                $this.experienceCurrent = parseInt($el.attr('value')) - levelObjSub.experience;
                $this.experienceMax = levelObj.experience - levelObjSub.experience;
            }
        });
    }

}