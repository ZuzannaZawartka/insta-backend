const model = require("./model")
module.exports = {
    add: (data) => {
        let id;
        if (model.photos.length > 0) {
            id = model.photos[model.photos.length - 1].id + 1
            console.log("ID" + id)
        } else {
            id = 0;
        }

        model.photos.push({
            id: id,
            album: data.fields.album,
            orginalName: data.files.file.name,
            url: data.url,
            lastChange: "orginal",
            history: [
                {
                    status: "orginal",
                    timestamp: data.files.file.lastModifiedDate,
                }
            ],
            tags: [

            ],
        })
    },

    addToHistory: (model, status, url) => {
        model.url = url

        model.history.push(
            {
                status: status,
                timestamp: Date.now(),
                url: url
            }
        )
    },
    delete: (id) => {
        model.photos = model.photos.filter(element => element.id != id)
        console.log(model.photos)
    },

    deleteAll: () => {
        model.photos = []
    },
    getOne: (id) => {
        return model.photos.find(elem => elem.id == id)
    },

    update: (data) => {
        console.log(data.id)
        let elem = model.photos.find(element => element.id == data.id)
        console.log(elem)
        if (elem) {
            elem.lastChange = "zmienione " + elem.history.length
            elem.history.push({
                status: elem.lastChange,
                timestamp: Date.now(),
            })
        }


    },

    getUrl: (photo) => {
        if (photo) {
            if (photo.history.length > 1) {
                return photo.history[photo.history.length - 1].url
            }
            return photo.url
        }

    }

    //tags functions

    // addTag: (data) => {
    //     model.tags.push({
    //         id: model.tags.length + 1,
    //         name: data,
    //     })
    // },

    //users functions


}