const model = require("./model")
const jsonController = require("./jsonController")
const sharp = require("sharp");
const FilterType = require("./FilterType");
module.exports = {

    createFilters: () => {
        new FilterType("metadata", "dostępne informacje o zdjęciu", "get", "Brak argumentow");
        new FilterType("rotate", "obrót w stopniach w prawo, ujemna wartość w lewo", "patch", "id obrazka, wartość angle = 0-360");
        new FilterType("resize", "Zmiana wielkosci obrazka", "patch", "id obrazka, w, h");
        new FilterType("reformat", "chyba negacja", "patch", "nic");
        new FilterType("crop", "chyba negacja", "patch", "width: 200, height: 200, left: 20, top: 20");
        new FilterType("grayscale", "chyba negacja", "patch", "nic");
        new FilterType("flip/flop", "flip/flop", "patch", "nic");
        new FilterType("negate", "flip/flop", "patch", "nic");
        new FilterType("tint", "tint", "patch", "{r:255,g:0,b:0}");
        console.log(model.filterList)
    },


    getMetaDate: async (photo) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (jsonController.getUrl(photo)) {
                    let meta = await sharp(jsonController.getUrl(photo))
                        .metadata()
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },

    rotate: async (file, angle) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-rotate.";
        newUrl += segments[segments.length - 1];
        await sharp(file.url)
            .rotate(angle)
            .toFile(newUrl);
        return newUrl;
    },


    resize: async (file, width, height) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-resize.";
        newUrl += segments[segments.length - 1];
        await sharp(file.url)
            .resize(width, height)
            .toFile(newUrl);
        return newUrl;
    },


    negate: async (file, width, height) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-negate.";
        newUrl += segments[segments.length - 1];
        await sharp(file.url)
            .negate()
            .toFile(newUrl);
        return newUrl;
    },

    reformat: async (file, to) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-reformat." + to;

        await sharp(file.url)
            .toFormat(to)
            .toFile(newUrl);
        return newUrl;
    },

    crop: async (file, width, height, top, left) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-crop.";
        newUrl += segments[segments.length - 1];

        await sharp(file.url)
            .extract({ width: width, height: height, left: left, top: top })
            .toFile(newUrl);
        return newUrl;
    },

    grayscale: async (file) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-grayscale.";
        newUrl += segments[segments.length - 1];

        await sharp(file.url)
            .grayscale()
            .toFile(newUrl);
        return newUrl;
    },


    flip: async (file) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-flip.";
        newUrl += segments[segments.length - 1];

        await sharp(file.url)
            .flip()
            .toFile(newUrl);
        return newUrl;
    },


    flop: async (file) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-flop.";
        newUrl += segments[segments.length - 1];

        await sharp(file.url)
            .flop()
            .toFile(newUrl);
        return newUrl;
    },

    tint: async (file, r, g, b) => {
        let segments = file.url.split(".")
        let newUrl = segments[0];
        for (let i = 1; i < segments.length - 1; i++) {
            newUrl += "." + segments[i];
        }
        newUrl += "-tint.";
        newUrl += segments[segments.length - 1];

        await sharp(file.url)
            .tint({ r: r, g: g, b: b })
            .toFile(newUrl);
        return newUrl;
    },





}

