Meteor.publish("events", function (options, searchString) {
    if (!searchString || searchString == null) {
        searchString = '';
    }

    let selector = {
        $or: [
            {name: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' }},
            {description: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' }}
        ],
        $and: [
            {owner: this.userId},
            {owner: {$exists: true}}
        ]
    };
    Counts.publish(this, 'numberOfEvents', Events.find(selector), {noReady: true});
    return Events.find(selector, options);
});