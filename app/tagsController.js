const model = require("./model")
module.exports = {


    init: () => {
        tagsInit()
    },

    addTag: (data) => {
        model.tags.push({
            id: model.tags.length + 1,
            name: data.name,
            popularity: data.popularity,
        })

        model.tagsRaw.push(data.name)
    },

    getTagWithId: (id) => {
        return model.tags.find(tag => tag.id == id)
    },

    addTagToPhoto: (data) => {
        console.log(data)
        let elem = model.photos.find(element => element.id == data.id)
        console.log(elem)

        if (elem) {
            if (data.tagId.length) {
                for (let i = 0; i <= data.tagId.length - 1; i++) {
                    let tag = model.tags.find(tag => tag.id == data.tagId[i])
                    if (tag) {
                        let isExist = elem.tags.find(tagx => tagx.id == data.tagId[i])
                        if (!isExist) {
                            elem.tags.push(tag)
                        }
                    }
                }
            } else {
                let tag = model.tags.find(tag => tag.id == data.tagId)
                if (tag) {
                    let isExist = elem.tags.find(tagx => tagx.id == tag.id)
                    if (!isExist) {
                        elem.tags.push(tag)
                    }
                }
            }
        }
    }


}

