class User {
    constructor(id, email) {
        this.id = id;
        this.email = email;
    }
}

var documentConveter = {
    toFirestore: function(user) {
        return {
            email: user.email
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new User(data.id, data.email);
    }
}