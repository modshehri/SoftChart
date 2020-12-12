class User {
    constructor(id, email, isWebsiteAdmin) {
        this.id = id;
        this.email = email;
        this.isWebsiteAdmin = isWebsiteAdmin;
    }
}

var documentConveter = {
    toFirestore: function(user) {
        return {
            email: user.email,
            isWebsiteAdmin: user.isWebsiteAdmin
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new User(data.id, data.email, data.isWebsiteAdmin);
    }
}