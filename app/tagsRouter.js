const fs = require("fs");
const jsonController = require("./jsonController");
const tagsController = require("./tagsController");
const { fileController, deleteFile } = require("./fileController");
const model = require("./model");

const tagsRouter = async (request, response) => {
    // pobranie jednego taga
    if (request.url.match(/\/api\/tags\/([0-9]+)/) && request.method == "GET") {
        let id = await getIdFromRequest(request)
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(tagsController.getTagWithId(id), null, 5));
    }

    // pobranie wszystkich tagów bez konwersji na obiekty
    if (request.url == "/api/tags/raw" && request.method == "GET") {
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.tagsRaw, null, 5));
    }

    // pobranie wszystkich tagów z konwersją na obiekty
    if (request.url == "/api/tags" && request.method == "GET") {
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.tags, null, 5));
    }

    // utworzenie nowego taga
    if (request.url == "/api/tags" && request.method == "POST") {
        let data = await getRequestData(request);
        tagsController.addTag(JSON.parse(data))
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.tags[model.tags.length - 1], null, 5));
    }

    // aktualizacja danych zdjęcia o nowy tag


    // pobranie tagów danego zdjęcia


}

getIdFromRequest = async (request) => {
    let id = request.url.split("/")
    return id[id.length - 1]
}

module.exports = tagsRouter