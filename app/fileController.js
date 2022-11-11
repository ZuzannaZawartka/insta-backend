const model = require("./model");
const formidable = require("formidable");
const path = require("path")
const form = formidable();
const fs = require("fs")
const readline = require('readline');
const jsonController = require("./jsonController");
const fsPromises = require("fs").promises

form.keepExtensions = true;


fileController = async (request) => {
    let path1 = path.join(__dirname, "files")

    let data = await new Promise((resolve, reject) => {
        try {
            console.log("WCHODZIMY W TRY")
            form.uploadDir = path1
            form.parse(request, async function (err, fields, files) {

                let url = "cos"
                resolve({ files, fields, url })
            });
        } catch (error) {

        }
    })

    let namex = data.fields.album
    let url = await getUrl(data.files, data.fields)

    try {
        await fsPromises.mkdir(path1 + "\\" + namex)
    } catch (error) { }

    await fsPromises.rename(data.files.file.path, url)

    data.url = url

    return data

}

saveProfileImage = async (request, usernameID) => {
    let path1 = path.join(__dirname, "files", "user-" + usernameID)
    form.uploadDir = path1

    if (!fs.existsSync(path1)) {
        fs.mkdir(path1, (err) => {
            if (err) throw err

        })
    }

    let data = await new Promise((resolve, reject) => {
        try {
            console.log("WCHODZIMY W TRY")
            form.uploadDir = path1
            form.parse(request, async function (err, fields, files) {
                console.log(files)
                let url = "cos"
                resolve({ files, fields, url })
            });
        } catch (error) {

        }
    })
}

getUrl = async (files, fields) => {
    let path1 = path.join(__dirname, "files")
    let name = files.file.path.split('\\');
    let url = path.join(path1 + "\\" + fields.album, name[name.length - 1])
    return url
}
deleteFile = async (filepath) => {
    try {
        await fsPromises.unlink(filepath);
        console.log("Usuniety")
    } catch (error) {
        console.log(error);
    }

}

tagsInit = () => {
    //path to file with tags

    let path1 = path.join(__dirname, "tags.txt")

    let rd = readline.createInterface({
        input: fs.createReadStream(path1),
        output: process.stdout,
        console: false
    });


    let count = 0;
    rd.on('line', function (line) {
        model.tagsRaw.push(line)
        model.tags.push({
            id: count,
            name: line,
            popularity: Math.floor(Math.random() * (1000 - 1) + 1),
        })
        count++;

    });
    return (model.tagsRaw)
}


showImage = async (path, response) => {
    let photo = model.photos.find(photo => photo.id == path[path.length - 1])
    if (photo) {
        path = photo.url
        if (photo.history.length > 1) {
            path = photo.history[photo.history.length - 1].url
        }

        fs.readFile(path, (error, data) => {
            if (error) {
                // response.writeHead(200, { "Content-type": "text/html" });
                // response.end("Not found");
                return false
            } else {
                response.writeHead(200, { "Content-type": "image/jpeg" });
                response.end(data);
            }
        })
    } else {

        // response.writeHead(200, { "Content-type": "text/html" });
        // response.end("Not found");
        return false
    }


}




module.exports = { fileController, deleteFile, tagsInit, saveProfileImage, showImage }