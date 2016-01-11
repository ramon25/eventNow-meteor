Meteor.publish("events", function (options) {
    let selector = {
        $or: [
            {
                $and: [
                    {"public": true},
                    {"public": {$exists: true}}
                ]
            },
            {
                $and: [
                    {owner: this.userId},
                    {owner: {$exists: true}}
                ]
            }
        ]
    };
    Counts.publish(this, 'numberOfEvents', Events.find(selector), {noReady: true});
    return Events.find(selector, options);
});