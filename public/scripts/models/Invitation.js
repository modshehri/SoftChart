class Invitation {
    constructor(id, docId, from, to) {
        this.id    = id;
        this.docId = docId;
        this.from  = from;
        this.to    = to;
    }

    static create(docId, from, to) {
        return new Invitation(null, docId, from, to);
    }

    accept() {
        this.status = "ACCEPTED";
    }

    reject() {
        this.status = "REJECTED";
    }
}