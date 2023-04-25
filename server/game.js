class Game {

    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.winner = null;
        this.equality = false;
        this.finished = false;
        this.board = ["", "", "", "", "", "", "", "", ""];
        this.winningBoard = [[0, 1 , 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    }

    changeTurn(){
        if(this.currentPlayer == this.player1){
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }

    checkMove(index){
        return this.board[index] == "";
    }

    checkPlayerTurn(player){
        return player == this.currentPlayer;
    }

    play(index){
        if(this.checkMove(index)){
            this.board[index] = this.currentPlayer.symbole;
        }
       
        this.checkWinning();
        this.checkEquality();
        if(this.winner != null || this.equality){
            this.finished = true; 
            return;
        } 

        this.changeTurn();
    }

    checkWinning(){
        this.winningBoard.forEach((winningPosition) => {
            if(this.board[winningPosition[0]] == this.currentPlayer.symbole && this.board[winningPosition[1]] == this.currentPlayer.symbole && this.board[winningPosition[2]] == this.currentPlayer.symbole){
                this.winner = this.currentPlayer;
            }
        });
    }

    checkEquality(){
        let isEqualBoard = true;

        this.board.forEach((position) => {
            if(position == ""){
                isEqualBoard = false;
                return;
            }
        });

        if(isEqualBoard){
            this.equality = true;
        }
    }

    restart(){
        this.board =  ["", "", "", "", "", "", "", "", ""];
        this.winner = null;
        this.equality = false;
        this.finished = false;
        this.currentPlayer = player1;
    }

    getPlayerById(id){
        let player = null;

        if(this.player1.id == id) player = this.player1;
        else if(this.player2.id == id) player = this.player2;
        

        return player;
    }

    getOtherPlayer(player){
        let playerReturn = null;

        if(player == this.player1) playerReturn = this.player2;
        else if(player == this.player2) playerReturn = this.player1;

        return playerReturn;
    }

    setWinner(player){
        this.winner = player;
        this.finished = true;
    }
}

export default Game;