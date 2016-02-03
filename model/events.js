Events = new Mongo.Collection("events");

Events.allow({
    insert: function (userId, event) {
        return userId && event.owner === userId;
    },
    update: function (userId, event, fields, modifier) {
        return userId && event.owner === userId;
    },
    remove: function (userId, event) {
        return userId && event.owner === userId;
    }
});

let getContactEmail = function (user) {
    if (user.emails && user.emails.length)
        return user.emails[0].address;

    if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;

    return null;
};

Meteor.methods({

});