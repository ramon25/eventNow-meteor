angular.module('eventNow').directive('eventDetails', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/events/event-details/event-details.html',
        controllerAs: 'eventDetails',
        controller: function ($scope, $stateParams, $reactive) {
            $reactive(this).attach($scope);

            this.subscribe('events');
            this.subscribe('users');

            this.helpers({
                event: () => {
                    return Events.findOne({ _id: $stateParams.eventId });
                },
                users: () => {
                    return Meteor.users.find({});
                },
                isLoggedIn: () => {
                    return Meteor.userId() !== null;
                }
            });

            this.save = () => {
                Events.update({_id: $stateParams.eventId}, {
                    $set: {
                        name: this.event.name,
                        description: this.event.description,
                        public: this.event.public
                    }
                });
            };

            this.invite = (user) => {
                Meteor.call('invite', this.event._id, user._id, (error) => {
                    if (error) {
                        console.log('Oops, unable to invite!');
                    }
                    else {
                        console.log('Invited!');
                    }
                });
            };

            this.canInvite = () => {
                if (!this.event)
                    return false;

                return !this.event.public && this.event.owner === Meteor.userId();
            };
        }
    }
});