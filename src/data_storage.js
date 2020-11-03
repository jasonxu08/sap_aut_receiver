var fs = require("fs");

const filename = "test.json";

var dataStorage = {
    autData: {
        mergeAuts: function (auts) {
            if (typeof auts != "object") {
                console.log("Input auts are invalid!");
                return;
            }

            var keys = Object.keys(auts);
            keys.forEach(function (key) {
                this.addAut(auts[key]);
            }.bind(this));
        },
        addAut: function (autToAdd) {
            if (this[autToAdd.hash] != null) {
                this.mergeProperties(autToAdd);
            } else {
                this[autToAdd.hash] = autToAdd;
            }
        },
        mergeProperties: function (autToAdd) {
            if (typeof autToAdd.properties != "object")
                return;

            var keys = Object.keys(autToAdd.properties);
            keys.forEach(function (key) {
                this[autToAdd.hash].properties[key] = autToAdd.properties[key];
            }.bind(this));
        }
    },
    initData: function () {
        this.read(function (rawData) {
            if (rawData == null)
                return;
            try {
                rawData = JSON.parse(rawData);
            } catch (err) {
                console.log("Error in parsing local file!");
                return;
            }

            this.autData.mergeAuts(rawData);

        }.bind(this));

    },
    filterKeysByType: function (type) {
        return Object.keys(this.autData).filter(function(key) {
            return this.autData[key].type == type;
        }.bind(this));
    },
    getAUTsByTypeInJSON: function(type) {
        var keys = this.filterKeysByType(type);
        var result = {};
        keys.forEach(function(key) {
            result[key] = this.autData[key];
        }.bind(this));
        return result;
    },
    processInput: function (message) {
        if (typeof message != "object")
            message = JSON.parse(message);

        if (message.type != null) {
            if (!this.messageValidation(message)) {
                console.log("message invalid!");
                return;
            }
        } else {
            Object.keys(message).forEach(function (key) {
                if (!this.messageValidation(message[key])){
                    console.log("messages invalid!");
                    return;
                }
            }.bind(this));
        }

        this.saveData(message);
    },
    saveData: function (message) {
        if (message.type != null) {
            this.autData.addAut(message);
        } else {
            Object.keys(message).forEach(function (key) {
                this.autData.addAut(message[key]);
            }.bind(this));
        }

        this.write(JSON.stringify(this.autData));
    },

    /* Should be like 
    "1314hj23h12hj4kh12": {
        "type": "sapedit",
        "hash": "1314hj23h12hj4kh12",
        "element": "<span></span>",
        "properties": {"name1": "value1",
                        "name2": "value2"},
        "url": "http://www.sap.com/test_page.html",
        "browser": "Chrome 80"
    } */
    messageValidation: function (message) {
        if (typeof message != "object" || typeof message.type != "string" || typeof message.hash != "string" || typeof message.elem != "string") {
            return false;
        }

        // Tolerate properties to be null
        if (message.properties != null && typeof message.properties != "object")
            return false;

        if (typeof message.url != "string" || typeof message.browser != "string")
            return false;

        return true;
    },
    read: function (callback) {
        fs.readFile(filename, "utf8", function (err, data) {
            console.log("readFile!");
            callback(data);
        });
    },
    append: function (data) {
        fs.appendFile(filename, data, function (err) {
            console.log("appendFile!");
        });
    },
    write: function (data) {
        fs.writeFile(filename, data, function (err) {
            console.log("writeFile!");
        });
    },
}

module.exports = dataStorage;