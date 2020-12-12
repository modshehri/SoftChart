class User {
    constructor(id, email, isWebsiteAdmin, isBlocked) {
        this.id = id;
        this.email = email;
        this.isWebsiteAdmin = isWebsiteAdmin;
        this.isBlocked = isBlocked;
    }
}

var documentConveter = {
    toFirestore: function(user) {
        return {
            email: user.email,
            isWebsiteAdmin: user.isWebsiteAdmin,
            isBlocked: user.isBlocked
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new User(data.id, data.email, data.isWebsiteAdmin, data.isBlocked);
    }
}