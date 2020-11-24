class Invitation {
    constructor(id, docId, senderId, recipientId) {
        this.id    = id;
        this.docId = docId;
        this.senderId  = senderId;
        this.recipientId = recipientId;
        this.status = "UNDECIDED";
    }
    
    static create(docId, senderId, recipientId) {
        return new Invitation(null, docId, senderId, recipientId, "UNDECIDED");
    }

    accept() {
        this.status = "ACCEPTED";
    }

    reject() {
        this.status = "REJECTED";
    }

    recipientHasDecided() {
        return this.status != null;
    }
}

var invitationConverter = {
    toFirestore: function(invitation) {
        return {
            docId: invitation.docId,
            senderId: invitation.senderId,
            recipientId: invitation.recipientId,
            status: invitation.status
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Invitation(data.id, data.docId, data.senderId, data.recipientId, data.status)
    }
}