angular.module('eventNow').directive('eventsList', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/events/events-list/events-list.html',
        controllerAs: 'eventsList',
        controller: function($scope, $reactive) {
            $reactive(this).attach($scope);

            this.newEvent = {};

            this.subscribe('events');

            this.helpers({
                events: () => {
                    return Events.find({});
                }
            });

            this.addEvent = () => {
                this.newEvent.owner = Meteor.user()._id;
                Events.insert(this.newEvent);
                this.newEvent = {};
            };

            this.removeEvent = (event) => {
                Events.remove({_id: event._id});
            }
        }
    }
});