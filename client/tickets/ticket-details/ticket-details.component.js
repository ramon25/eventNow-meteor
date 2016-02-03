angular.module('eventNow').directive('ticketDetails', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/tickets/ticket-details/ticket-details.html',
        controllerAs: 'ticketDetails',
        controller: function ($scope, $stateParams, $reactive) {
            $reactive(this).attach($scope);

            this.subscribe('tickets');
            //this.subscribe('users');

            this.helpers({
                event: () => {
                    return Events.findOne({ _id: $stateParams.eventId });
                },
                //users: () => {
                //    return Meteor.users.find({});
                //},
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
        }
    }
});