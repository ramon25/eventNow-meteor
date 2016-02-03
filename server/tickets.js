Meteor.publish("tickets", function (options, searchString) {
    if (!searchString || searchString == null) {
        searchString = '';
    }

    let selector = {
        event: options.event,
    //    $and: [
    //        {owner: this.userId},
    //        {owner: {$exists: true}}
    //    ]
    };
    Counts.publish(this, 'numberOfTickets', Tickets.find(selector), {noReady: true});
    return Tickets.find(selector, options);
});