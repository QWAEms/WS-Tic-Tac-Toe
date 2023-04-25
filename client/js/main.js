const ws = new WebSocket("ws://localhost:8080");
let playerName = null;
let playerSymbole = null;
let board = [];
let currentPlayer = null;
let ready = false;
let playerid = null;
let winner = null;

ws.binaryType = "binary";

ws.sendData = function(data){
    ws.send(JSON.stringify(data));
}

ws.onopen = () => {
    ws.send(JSON.stringify({getBoard: true}));
}

ws.onmessage = (message) => {
    message = JSON.parse(message.data);
    
    if(message.message){
        console.log(message.message);
    }

    if(message.playerInfo){
        playerName = message.name;
        playerSymbole = message.symbole;
        playerid = message.playerid;
    }

    if(message.getBoard){
        board = message.board;
    }

    if(message.ready && !ready) {
        ready = true;
        currentPlayer = message.currentPlayer;
        board = message.board;
        play();
    }

    if(message.nextTurn){
        currentPlayer = message.currentPlayer;
        board = message.board;
        play();
    }

    if(message.finished){
        board = message.board;
        winner = message.winner;
        if(winner == null){
            equality();
        }else {
            win(winner);
        }
        ready = false;
    }
}

function play(){
    document.getElementById("finish").innerHTML = "";
    document.getElementById("playerName").innerHTML = playerName + " symbole : " + playerSymbole;

    if(currentPlayer != null){
        document.getElementById("playerTurn").innerHTML = currentPlayer.name + " Turn";
    }

    drawBoard();
}

function drawBoard(){
    let gameContainer = document.getElementById("game");

    gameContainer.innerHTML = "";

    board.forEach(function each(position, index) {
       let div = document.createElement("div");
       div.classList.add("boardCase");
       div.innerHTML = position;
       div.addEventListener("click", () => {
            ws.sendData({play: true, index: index, playerid: playerid});  
       });
       gameContainer.append(div);
    });
}

function equality(){
    drawBoard();
    document.getElementById("finish").innerHTML = "Draw game!";
}

function win(winner){
    drawBoard();
    document.getElementById("finish").innerHTML = winner.name + " Won the game";
}

    
    