const fs = require("fs");
const jsonController = require("./jsonController");
const { fileController, deleteFile, tagsInit, saveProfileImage } = require("./fileController");
const usersController = require("./usersController");
const getRequestData = require("./getRequestData");
const model = require("./model");
const jsonwebtoken = require("./jsonwebtoken");

let this_token = null;

const usersRouter = async (request, response) => {

    // if (request.url.match(/\/api\/photos\/([0-9]+)/) && request.method == "GET") {
    //     response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
    //     response.end(JSON.stringify(jsonController.getOne(await getIdFromRequest(request)), null, 5));
    // }


    if (request.url == "/api/user/email" && request.method == "POST") {
        let data = await getRequestData(request);
        usersController.sendMail(JSON.parse(data))
        //jsonController.add(data)
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(model.users, null, 5));
    }


    if (request.url == "/api/user/profile" && request.method == "POST") {
        if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {

            let token = request.headers.authorization.split(" ")[1]
            if (isLog(token)) { // JESLI jest zalogowany
                console.log("ZALOGOWANY")
                data = await usersController.getUserFromToken(token) // jesli jest uzytkownik o takim tokenie
                if (data) {
                    console.log("JEST")
                    saveProfileImage(request, data.id)
                } else {
                    response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                    response.end(JSON.stringify("Nie ma takiego uztkownika", null, 5));
                }

            } else {
                response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                response.end(JSON.stringify("User wylogowany", null, 5));
            }
        }
        //jsonController.add(data)
    }




    if (request.url == "/api/user/register" && request.method == "POST") {
        let data = await getRequestData(request);
        if (!model.users.find(user => user.email == JSON.parse(data).email)) {
            let reg = await usersController.register(JSON.parse(data))
            console.log(reg.data)
            if (reg.isReg) {

                await usersController.addUser(reg.data)

                //odkomentuj wysylani emaila

                await usersController.sendMailToConfirm({
                    email: reg.data.email,
                    token: reg.data.token
                })
            }

            response.writeHead(201, { "Content-Type": "application/json" }); // user created
            response.end(JSON.stringify(model.users, null, 5));
        } else {
            response.writeHead(201, { "Content-Type": "application/json" }); // user created
            response.end(JSON.stringify("Uzytkownik o takim mailu istnieje", null, 5));
        }



    }

    if (request.url == "/api/user/login" && request.method == "POST") {
        let data = await getRequestData(request);
        let data2 = await usersController.login(JSON.parse(data))
        console.log(data2)
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(data2, null, 5));
    }




    if (request.url.search("/api/user/confirm") != -1) {
        let token = await getIdFromRequest(request)
        let data = await jsonwebtoken.verifyToken(token)
        if (data) {
            usersController.confirmMail(data.email)
        }
        response.end(JSON.stringify(model.users, null, 5));
    }
    if (request.url.search("/api/user") != -1 && request.method == "GET") {


        if (request.url == "/api/user/logout" && request.method == "GET") {
            if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
                console.log("wCHODZI W TOKEN")
                // czytam dane z nagłowka
                let token = request.headers.authorization.split(" ")[1]

                if (isLog(token)) {
                    console.log("ZALGOWAN")
                    data = await usersController.getUserFromToken(token)
                    if (data) {

                        model.logoutToken.push(token)
                        console.log(model.logoutToken)
                        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                        response.end(JSON.stringify("Wylogowano", null, 5));
                    }
                } else {
                    response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                    response.end(JSON.stringify("User wylogowany", null, 5));
                }
            } else {
                response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                response.end(JSON.stringify("Niepoprawny Token", null, 5));
            }

        } else {
            let data = "";
            if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
                // czytam dane z nagłowka
                let token = request.headers.authorization.split(" ")[1]
                if (isLog(token)) {
                    data = await usersController.getUserFromToken(token)
                }
                response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                response.end(JSON.stringify(data, null, 5));
            }

        }



    }

    if (request.url.search("/api/user") != -1 && request.method == "PATCH") {
        let data = await getRequestData(request);
        console.log(JSON.parse(data))
        let data2 = ""
        if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
            // czytam dane z nagłowka
            let token = request.headers.authorization.split(" ")[1]
            if (isLog(token)) {
                if (await usersController.getUserFromToken(token)) {
                    data2 = await usersController.changeProfileData(token, JSON.parse(data))
                    response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                    response.end(JSON.stringify(data2, null, 5));
                }
            }
        }
        response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        response.end(JSON.stringify(data2, null, 5));
    }

}

function isLog(token) {
    if (model.logoutToken.find(tok => tok == token)) {
        return false
    }

    return true
}

getIdFromRequest = async (request) => {
    let id = request.url.split("/")
    return id[id.length - 1]
}

module.exports = usersRouter