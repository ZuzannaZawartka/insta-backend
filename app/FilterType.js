const model = require("./model");

class FilterType {
    static idCounter = 0;
    constructor(name, description, method, args) {
        this.id = FilterType.idCounter++;
        this.name = name;
        this.description = description;
        this.method = method;
        this.args = args;

        model.filterList.push(this)
    }
}

module.exports = FilterType;