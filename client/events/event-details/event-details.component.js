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
        }
    }
});