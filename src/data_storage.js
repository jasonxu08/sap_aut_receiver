var fs = require("fs");

const filename = "test.json";

var dataStorage = {
    autData: {
        addAut: function (autToAdd) {
            if (this[autToAdd.hash] != null) {
                this.mergeProperties(autToAdd.hash, autToAdd);
            } else {
                this[autToAdd.hash] = autToAdd;
            }
        },
        mergeProperties: function (hashKey, autToAdd) {
            autToAdd.properties.forEach(function(property) {
                this.addProperty(hashKey, property);
            }.bind(this));
        },
        addProperty: function (hashKey, propertyToAdd) {
            var property = this.findProperty(this[hashKey].properties, propertyToAdd);
            if (property != null) {
                property.value = propertyToAdd.value;
            } else {
                this[hashKey].properties.push(propertyToAdd);
            }
        }, 
        findProperty: function(properties, propertyToFind) {
            return properties.find(function (property) {
                return property.name == propertyToFind.name;
            });
        }
    },
    initData: function () {
        this.read(function(rawData) {
            if (rawData == null)
                rawData = "";
            try {
                rawData = JSON.parse("{\"data\": [" + rawData + "]}");
            } catch (err) {
    
            }
            rawData.data.forEach(function(data) {
                this.autData.addAut(data);
            }.bind(this));
        }.bind(this));
        
    },
    getData: function () {
        return this.autData;
    },
    saveData: function (message) {
        var msgObj = JSON.parse(message);
        if (!this.messageValidation(msgObj))
            return;

        this.autData.addAut(msgObj);

        this.write(JSON.stringify(this.autData));
    },

    /* Should be like 
    {
        "type": "",
        "hash": "",
        "properties": [{"name": "","value": ""},
                        {"name": "","value": ""}],
        "url": "",
        "browser": {
        "type": "",
        "version": ""
        }
    } */
    messageValidation: function (message) {
        if (typeof message != "object" || typeof message.type != "string" || typeof message.hash != "string") {
            return false;
        }

        // Tolerate properties to be null
        if (message.properties != null && !this.propertiesValidation(message.properties))
            return false;

        if (typeof message.url != "string" || typeof message.browser != "string")
            return false;

        return true;
    },
    propertiesValidation: function (properties) {
        if (!Array.isArray(properties))
            return false;

        var invalidProperty = properties.some(function(property) {
            return typeof property.name != "string" || typeof property.value != "string";
        });
        if (invalidProperty)
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