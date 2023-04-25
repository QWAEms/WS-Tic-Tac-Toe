import WebSocket, { WebSocketServer } from 'ws';
import Lobby from './lobby.js';
import Game from './game.js';
import Player from './player.js';

const websocketserver = new WebSocketServer({ port: 8080 });
const gameLobby = new Lobby("Game lobby", 2);
let game = null;

websocketserver.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

websocketserver.sendClient = function(client, data){
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
    }
}

websocketserver.sendLobby = function(lobby, data){
    lobby.connectedClients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
    });
}

websocketserver.on('connection', function connection(ws) {
    
    ws.id = websocketserver.getUniqueID();
    gameLobby.addClient(ws);

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        data = JSON.parse(data);

        if(data.message) {
            console.log(data.message);
        }

        if(data.getBoard){
            if(game != null){
                websocketserver.sendLobby(gameLobby, {getBoard: true, board: game.board});
            }
        }

        if(data.play){
            if(game != null){
                let player = game.getPlayerById(data.playerid);
                
                if(game.checkPlayerTurn(player)) {
                    game.play(data.index);
                    if(!game.finished){
                        websocketserver.sendLobby(gameLobby, {nextTurn: true, board: game.board, currentPlayer: game.currentPlayer});
                    }else {
                        websocketserver.sendLobby(gameLobby, {finished: true, board: game.board, winner: game.winner});
                        game = null;
                    }
                }


            }
        }
    });

    ws.on("close", () => {
        
        if(game != null){
            let player = game.getPlayerById(ws.id);

            if(player != null && !game.finished){
                let gameWinner = game.getOtherPlayer(player);
                game.setWinner(gameWinner);
                websocketserver.sendLobby(gameLobby, {finished: true, board: game.board, winner: game.winner});
                game = null;
            }
        }
        gameLobby.disconnectClient(ws);
    });

    if(gameLobby.isReady()){
        gameLobby.connectedClients[0].name = "Player 1";
        gameLobby.connectedClients[1].name = "Player 2";
        gameLobby.connectedClients[0].symbole = "o";
        gameLobby.connectedClients[1].symbole = "x";
        
        game = new Game(new Player(gameLobby.connectedClients[0].name, gameLobby.connectedClients[0].id, gameLobby.connectedClients[0].symbole),
                        new Player(gameLobby.connectedClients[1].name, gameLobby.connectedClients[1].id, gameLobby.connectedClients[1].symbole));

        websocketserver.sendClient(gameLobby.connectedClients[0], {playerInfo: true, name: gameLobby.connectedClients[0].name, symbole : gameLobby.connectedClients[0].symbole, playerid: gameLobby.connectedClients[0].id});
        websocketserver.sendClient(gameLobby.connectedClients[1], {playerInfo: true, name: gameLobby.connectedClients[1].name, symbole : gameLobby.connectedClients[1].symbole, playerid: gameLobby.connectedClients[1].id});

        
        websocketserver.sendLobby(gameLobby, {message : "Game ready!", ready: true, currentPlayer: game.currentPlayer, board: game.board});
    }else {
        websocketserver.sendLobby(gameLobby, {message : "Still waiting for players...", ready: false});
    }
    

});



console.log("Websocket listening...");