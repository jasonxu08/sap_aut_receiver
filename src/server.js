const serverPort = 3000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    WebSocket = require("ws"),
    dataStorage = require("./data_storage");


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
        dataStorage.initData();

        //send feedback to the incoming connection
        webSocketClient.send('{ "connection" : "ok1"}');

        webSocketClient.on('message', sapAutService.onMessage);
    },

    onMessage: function(message) {

        dataStorage.saveData(message);
    },


    
}

module.exports = sapAutService;