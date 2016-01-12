Meteor.publish("events", function (options, searchString) {
    if (!searchString || searchString == null) {
        searchString = '';
    }

    let selector = {
        name: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
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