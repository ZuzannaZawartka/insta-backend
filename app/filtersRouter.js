const model = require("./model");
const filtersController = require("./filtersController");
const jsonController = require("./jsonController");
const getRequestData = require("./getRequestData");
const run = require("nodemon/lib/monitor/run");
filtersController.createFilters()
const filtersRouter = async (request, response) => {



    // pobranie wszystkich tagów bez konwersji na obiekty
    if (request.url == "/api/filters" && request.method == "GET") {
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.filterList, null, 5));
    }

    if (request.url == "/api/filters" && request.method == "PATCH") {

        let data = await getRequestData(request)
        let url;
        data = JSON.parse(data)
        let file = await jsonController.getOne(data.id)
        if (file == null) {
            response.end("[]")
        } else {

            if (data.filter == "rotate") {
                console.log(file)
                url = await filtersController.rotate(file, data.angle)

                jsonController.addToHistory(model.photos.find(photo => photo == file), "angle", url)
            }


            if (data.filter == "resize") {
                url = await filtersController.resize(file, data.width, data.height)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "resize", url)

            }


            if (data.filter == "negate") {
                url = await filtersController.negate(file)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "negate", url)
            }

            if (data.filter == "reformat") {
                url = await filtersController.reformat(file, data.to)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "reformat", url)
            }

            if (data.filter == "crop") {
                url = await filtersController.crop(file, data.width, data.height, data.top, data.left)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "crop", url)
            }

            if (data.filter == "grayscale") {
                url = await filtersController.grayscale(file)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "grayscale", url)
            }

            if (data.filter == "flip") {
                url = await filtersController.flip(file)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "flip", url)
            }

            if (data.filter == "flop") {
                url = await filtersController.flop(file)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "flop", url)
            }

            if (data.filter == "tint") {
                url = await filtersController.tint(file, data.r, data.g, data.b)
                jsonController.addToHistory(model.photos.find(photo => photo == file), "tint", url)
            }
            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            response.end(JSON.stringify(model.photos.find(photo => photo == file), null, 5));
        }
    }

    // pobranie wszystkich tagów z konwersją na obiekty
    if (request.url.match(/\/api\/filters\/metadata\/([0-9]+)/) && request.method == "GET") {
        let date = ""
        let id = await getIdFromRequest(request)
        let file = await jsonController.getOne(id)
        console.log(file)
        if (file == null) {
            response.end("[]")
        } else {
            let data = await filtersController.getMetaDate(file)
            console.log(data)
            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            response.end(JSON.stringify(data, null, 5));

        }


    }
}

getIdFromRequest = async (request) => {
    let id = request.url.split("/")
    return id[id.length - 1]
}

module.exports = filtersRouter