Meteor.startup(function () {
    if (Events.find().count() === 0) {
        var events = [
            {
                'name': 'Dubstep-Free Zone',
                'description': 'Fast just got faster with Nexus S.'
            },
            {
                'name': 'All dubstep all the time',
                'description': 'Get it on!'
            },
            {
                'name': 'Savage lounging',
                'description': 'Leisure suit required. And only fiercest manners.'
            }
        ];

        for (var i = 0; i < events.length; i++) {
            Events.insert(events[i]);
        }
    }
});