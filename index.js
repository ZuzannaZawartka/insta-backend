const http = require('http');
const imageRouter = require("./app/imageRouter")
const usersRouter = require("./app/usersRouter")
const tagsRouter = require("./app/tagsRouter")
const filtersRouter = require("./app/filtersRouter")
const tagsController = require("./app/tagsController")
// const PORT = 3000;
const dotenv = require('dotenv');
dotenv.config({ path: "./plik.env" });

tagsController.init()

http.createServer(async (req, res) => {

    //images


    if (req.url.search("/api/photos") != -1) {
        console.log(req.url)
        await imageRouter(req, res)
    }

    //tags

    else if (req.url.search("/api/tags") != -1) {
        await tagsRouter(req, res)
    }

    //mails

    else if (req.url.search("/api/user") != -1) {
        await usersRouter(req, res)
    }

    else if (req.url.search("/api/filters") != -1) {
        await filtersRouter(req, res)
    }

})
    .listen(process.env.APP_PORT, () => console.log(`listen on ${process.env.APP_PORT}`))