Tickets = new Mongo.Collection("tickets");

Tickets.allow({
    insert: function (userId, ticket) {
        var event = Events.findOne({_id: ticket.event});
        return userId && event.owner === userId;
    },
    update: function (userId, ticket, fields, modifier) {
        var event = Events.findOne({_id: ticket.event});
        return userId && event.owner === userId;
    },
    remove: function (userId, ticket) {
        var event = Events.findOne({_id: ticket.event});
        return userId && event.owner === userId;
    }
});