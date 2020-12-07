class Connection {
    constructor(id, fromId, toId) {
        this.id = id;
        this.fromId = fromId;
        this.toId = toId;
    }

    static create(fromId, toId) {
        return new Connection(null, fromId, toId);
    }
}

var connectionConverter = {
    toFirestore: function(connection) {
        return {
            fromId: connection.fromId,
            toId: connection.toId
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Connection(data.id, data.fromId, data.toId);
    }
}