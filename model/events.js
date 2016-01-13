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
    invite: function (eventId, userId) {
        check(eventId, String);
        check(userId, String);

        let event = Events.findOne(eventId);

        if (!event)
            throw new Meteor.Error(404, "No such event!");

        if (event.owner !== this.userId)
            throw new Meteor.Error(404, "No permissions!");

        if (event.public)
            throw new Meteor.Error(400, "That event is public. No need to invite people.");

        if (userId !== event.owner && ! _.contains(event.invited, userId)) {
            Events.update(event, { $addToSet: { invited: userId } });

            let from = getContactEmail(Meteor.users.findOne(this.userId));
            let to = getContactEmail(Meteor.users.findOne(userId));

            if (Meteor.isServer && to) {
                Email.send({
                    from: "noreply@eventnow.ch",
                    to: to,
                    replyTo: from || undefined,
                    subject: "Event: " + event.name,
                    text:
                    "Hey, I just invited you to '" + event.name + "' on eventNow." +
                    "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
                });
            }
        }
    },
    rsvp: function (eventId, rsvp) {
        check(eventId, String);
        check(rsvp, String);

        if (!this.userId)
            throw new Meteor.Error(403, "You must be logged in to RSVP");

        if (!_.contains(['yes', 'no', 'maybe'], rsvp))
            throw new Meteor.Error(400, "Invalid RSVP");

        let event = Events.findOne(eventId);

        if (!event)
            throw new Meteor.Error(404, "No such event");

        if (!event.public && event.owner !== this.userId && !_.contains(event.invited, this.userId))
            throw new Meteor.Error(403, "No such event"); // its private, but let's not tell this to the user

        let rsvpIndex = _.indexOf(_.pluck(event.rsvps, 'user'), this.userId);

        if (rsvpIndex !== -1) {
            // update existing rsvp entry
            if (Meteor.isServer) {
                // update the appropriate rsvp entry with $
                Events.update(
                    {_id: eventId, "rsvps.user": this.userId},
                    {$set: {"rsvps.$.rsvp": rsvp}});
            } else {
                // minimongo doesn't yet support $ in modifier. as a temporary
                // workaround, make a modifier that uses an index. this is
                // safe on the client since there's only one thread.
                let modifier = {$set: {}};
                modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;

                Events.update(eventId, modifier);
            }
        } else {
            // add new rsvp entry
            Events.update(eventId,
                {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
        }
    }
});