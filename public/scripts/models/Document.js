class Document {
    constructor(id, adminUid, name, users) {
        this.id = id;
        this.adminUid = adminUid;
        this.name = name;
        this.users = users;
    }

    static create(adminUid, name) {
        return new Document(null, adminUid, name, [adminUid])
    }

    isDocumentAdmin(uid) {
        return this.adminUid == uid
    }
}

var documentConveter = {
    toFirestore: function(document) {
        return {
            adminUid: document.adminUid,
            name: document.name,
            users: document.users
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Document(data.id, data.adminUid, data.name, data.users);
    }
}