const serverPort = 3000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    WebSocket = require("ws");

var fs = require("fs");

var sapAutService = {
    init: function() {
        websocketServer = new WebSocket.Server({ server }),

        //when a websocket connection is established
        websocketServer.on('connection', this.onConnection);
    
        //start the web server
        server.listen(serverPort, () => {
            console.log(`Websocket server started on port ` + serverPort);
        });
    },

    onConnection: function(webSocketClient) { 
        // read test.json to memory

        //send feedback to the incoming connection
        webSocketClient.send('{ "connection" : "ok1"}');

        webSocketClient.on('message', sapAutService.onMessage);
    },

    onMessage: function(message) {
        var msgObj = JSON.parse(message);
        if (!sapAutService.messageValidation(msgObj))
            return;
        // check hash
        // add to memory

        fs.writeFile("test.json", message, function(err) {
            console.log("error!");
        });
    },

    /* Should be like 
    {
        "type": "",
        "hash": "",
        "attribute": {
        "name": "",
        "value": ""
        },
        "url": "",
        "browser": {
        "type": "",
        "version": ""
        }
    } */
    messageValidation: function(message) {
        if (typeof message != "object" || typeof message.type != "string" || typeof message.hash != "string")
            return false;
        if (typeof message.attribute == "object") {
            if (typeof message.attribute.name != "string" || typeof message.attribute.value != "string")
                return false;
        }
        if (typeof message.browser == "object") {
            if (typeof message.browser.type != "string" || typeof message.browser.version != "string")
                return false;
        }
        return true;
    }
    
}

module.exports = sapAutService;