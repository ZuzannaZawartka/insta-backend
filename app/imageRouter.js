const fs = require("fs");
const jsonController = require("./jsonController");
const { fileController, deleteFile, tagsInit, saveProfileImage, showImage } = require("./fileController");
const model = require("./model");
const sharp = require("sharp");
const tagsController = require("./tagsController");
const getRequestData = require("./getRequestData");

const imageRouter = async (request, response) => {


    //POBRANIE PHOTO O ID
    if (request.url.match(/\/api\/photos\/([0-9]+)/) && request.method == "GET") {
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(jsonController.getOne(await getIdFromRequest(request)), null, 5));
    }


    //USUNIECIE ZDJ
    if (request.url.match(/\/api\/photos\/([0-9]+)/) && request.method == "DELETE") {
        let id = await getIdFromRequest(request)
        let data = jsonController.getOne(id)
        let data2;
        if (data) {
            data2 = await deleteFile(jsonController.getOne(id).url);
            jsonController.delete(id)
        }
        response.end(JSON.stringify(model.photos, null, 5));
    }


    //UPDATE ZDJ 
    if (request.url == "/api/photos" && request.method == "PATCH") {
        let data = await getRequestData(request);
        //console.log(data.id)
        console.log(data)
        jsonController.update(JSON.parse(data))
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.photos, null, 5));
    }


    //POBRANIE WSZYSTKICH ZDJEC
    if (request.url == "/api/photos" && request.method == "GET") {
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.photos, null, 5));
    }


    //DODANIE PHOTO
    if (request.url == "/api/photos" && request.method == "POST") {
        let data = await fileController(request, response)
        jsonController.add(data)
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.photos, null, 5));
    }


    ////TAGI 

    //DODANIE TAGU DO ZDJ
    if (request.url == "/api/photos/tags" && request.method == "PATCH") {
        let data = await getRequestData(request)
        tagsController.addTagToPhoto(JSON.parse(data))
        let id = JSON.parse(data).id
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(jsonController.getOne(id), null, 5));
    }

    // DODANIE TAGOW MASOWO
    if (request.url == "/api/photos/tags/mass" && request.method == "PATCH") {
        let data = await getRequestData(request)
        let id = JSON.parse(data).id
        tagsController.addTagToPhoto(JSON.parse(data))
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(jsonController.getOne(id), null, 5));
    }


    //POBRANIE TAGOW ZDJECIA
    if (request.url.match(/\/api\/photos\/tags\/([0-9]+)/) && request.method == "GET") {
        console.log("dziala")
        let id = await getIdFromRequest(request)
        let file = jsonController.getOne(id)
        let data = ""
        if (file) {
            file = jsonController.getOne(id).tags
            data = {
                id: id,
                tags: jsonController.getOne(id).tags
            }
            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            response.end(JSON.stringify(data, null, 5));
        } else {
            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            response.end("BRAK");
        }
    }

    //FILTRY

    //POBIERANIE TINT
    console.log(request.url)
    if (request.url.match(/\/api\/photos\/uploads\/([0-9]+)/) && request.method == "GET") {
        console.log("POBEIRAIE API")
        let path = request.url.split("/")
        let data = await showImage(path, response)

        if (data == false) {
            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            response.end("BRAK");
        }

        // response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        // response.end();

        // showImage(path, response)


    }
}

getIdFromRequest = async (request) => {
    let id = request.url.split("/")
    return id[id.length - 1]
}

module.exports = imageRouter