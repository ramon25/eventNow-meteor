angular.module('eventNow').directive('eventDetails', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/events/event-details/event-details.html',
        controllerAs: 'eventDetails',
        controller: function ($scope, $stateParams, $reactive) {
            $reactive(this).attach($scope);

            this.newTicket = {};

            this.subscribe('events');
            this.subscribe('tickets', () => { return [{event: $stateParams.eventId}]});
            //this.subscribe('users');

            this.helpers({
                event: () => {
                    return Events.findOne({ _id: $stateParams.eventId });
                },
                tickets: () => {
                    return Tickets.find({});
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

            this.addTicket = () => {
                this.newTicket.event = $stateParams.eventId;
                Tickets.insert(this.newTicket);
                this.newTicket = {};
            };
        }
    }
});