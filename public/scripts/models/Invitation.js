class Invitation {
    constructor(id, docId, docName, senderId, senderEmail, recipientId, status) {
        this.id    = id;
        this.docId = docId;
        this.docName = docName;
        this.senderId  = senderId;
        this.senderEmail = senderEmail;
        this.recipientId = recipientId;
        this.status = status;
    }

    static create(docId, docName, senderId, senderEmail, recipientId) {
        return new Invitation(null, docId, docName, senderId, senderEmail, recipientId, "UNDECIDED");
    }

    accept() {
        this.status = "ACCEPTED";
    }

    reject() {
        this.status = "REJECTED";
    }

    recipientHasDecided() {
        return this.status != "UNDECIDED";
    }
}

var invitationConverter = {
    toFirestore: function(invitation) {
        return {
            docId: invitation.docId,
            docName: invitation.docName,
            senderId: invitation.senderId,
            senderEmail: invitation.senderEmail,
            recipientId: invitation.recipientId,
            status: invitation.status
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Invitation(data.id, data.docId, data.docName, data.senderId, data.senderEmail, data.recipientId, data.status)
    }
}