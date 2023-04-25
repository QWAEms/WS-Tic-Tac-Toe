class Lobby {

    constructor(name, maxConnection){
        this.name = name;
        this.maxConnection = maxConnection;
        this.connectedClients = [];
    }

    addClient(client){
        if(this.connectedClients.length >= this.maxConnection) return;
        
        this.connectedClients.push(client);
    }

    disconnectClient(client){
        this.connectedClients.forEach((connectedClient, index) => {
            if(connectedClient == client){
                this.connectedClients.splice(index, 1);
            }
        })
    }

    getClients() {
        return this.connectedClients;
    }

    isReady(){
        return this.connectedClients.length == this.maxConnection;
    }
}

export default Lobby;