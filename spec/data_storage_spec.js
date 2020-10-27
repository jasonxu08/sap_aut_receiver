var jamine = require("jasmine");
var data_storage = require("../src/data_storage");

describe("Test data storage", function () {
    describe("Test aut data", function () {
        beforeEach(function () {
            data_storage.autData["hash"] = {
                "hash": "hash",
                "properties": [
                    { "name": "name1", "value": "value1" },
                    { "name": "name2", "value": "value2" }]
            };
        });
        it("should successfully run findProperty", function () {
            var propertyToFind = { "name": "name2", "value": "new value" };
            var property = data_storage.autData.findProperty(data_storage.autData["hash"].properties, propertyToFind);
            expect(JSON.stringify(property)).toEqual(JSON.stringify({ "name": "name2", "value": "value2" }));

        });
        it("should overwrite existing value when run addProperty", function () {
            var propertyToAdd = { "name": "name2", "value": "new value" };
            data_storage.autData.addProperty("hash", propertyToAdd);
            expect(JSON.stringify(data_storage.autData["hash"].properties)).toEqual(JSON.stringify([
                { "name": "name1", "value": "value1" },
                { "name": "name2", "value": "new value" }]));
        });
        it("should add a new property when run addProperty", function () {
            var propertyToAdd = { "name": "name3", "value": "new value" };
            data_storage.autData.addProperty("hash", propertyToAdd);
            expect(JSON.stringify(data_storage.autData["hash"].properties)).toEqual(JSON.stringify([
                { "name": "name1", "value": "value1" },
                { "name": "name2", "value": "value2" },
                { "name": "name3", "value": "new value" }]));
        });
        it("should successfully run mergeProperties", function () {
            var autToMerge = {
                "properties": [
                    { "name": "name1", "value": "new value" },
                    { "name": "name3", "value": "new value" }]
            };
            data_storage.autData.mergeProperties("hash", autToMerge);
            expect(JSON.stringify(data_storage.autData["hash"].properties)).toEqual(JSON.stringify([
                { "name": "name1", "value": "new value" },
                { "name": "name2", "value": "value2" },
                { "name": "name3", "value": "new value" }]));
        });
        it("should successfully run addAut", function () {
            var aut1 = {
                    "hash": "hash",
                    "properties": [
                        { "name": "name1", "value": "new value" },
                        { "name": "name3", "value": "new value" }]
            };
            var aut2 = {
                    "hash": "new hash",
                    "properties": [
                        { "name": "name1", "value": "value1" },
                        { "name": "name2", "value": "value2" }]
            };
            data_storage.autData.addAut(aut1);
            data_storage.autData.addAut(aut2);
            expect(JSON.stringify(data_storage.autData)).toEqual(JSON.stringify({
                "hash": {
                    "hash": "hash",
                    "properties": [
                        { "name": "name1", "value": "new value" },
                        { "name": "name2", "value": "value2" },
                        { "name": "name3", "value": "new value" }]
                },
                "new hash": {
                    "hash": "new hash",
                    "properties": [
                        { "name": "name1", "value": "value1" },
                        { "name": "name2", "value": "value2" }]
                }
            }));

        });
    });
});