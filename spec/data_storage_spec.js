var jamine = require("jasmine");
var data_storage = require("../src/data_storage");

describe("Test data storage", function () {
    describe("Test aut data", function () {
        it("should successfully run addAut", function () {
            data_storage.autData["hash"] = {
                "hash": "hash",
                "properties": {
                    "name1": "value1",
                    "name2": "value2"
                }
            };
            var aut1 = {
                "hash": "hash",
                "properties": {
                    "name1": "new value",
                    "name3": "new value"
                }
            };
            var aut2 = {
                "hash": "new hash",
                "properties": {
                    "name1": "value1",
                    "name3": "value3"
                }
            };
            data_storage.autData.addAut(aut1);
            data_storage.autData.addAut(aut2);
            expect(JSON.stringify(data_storage.autData)).toEqual(JSON.stringify({
                "hash": {
                    "hash": "hash",
                    "properties": {
                        "name1": "new value",
                        "name2": "value2",
                        "name3": "new value"
                    }
                },
                "new hash": {
                    "hash": "new hash",
                    "properties": {
                        "name1": "value1",
                        "name3": "value3"
                    }
                }
            }));

        });
    });
});