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