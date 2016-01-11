angular.module('eventNow').directive('eventsList', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/events/events-list/events-list.html',
        controllerAs: 'eventsList',
        controller: function($scope, $reactive) {
            $reactive(this).attach($scope);

            this.newEvent = {};
            this.perPage = 3;
            this.page = 1;
            this.sort = {
                name: 1
            };

            this.subscribe('events', () => {
                return [
                    {
                        limit: parseInt(this.perPage),
                        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
                        sort: this.getReactively('sort')
                    }
                ]
            });

            this.helpers({
                events: () => {
                    return Events.find({}, { sort : this.getReactively('sort') });
                },
                eventsCount: () => {
                    return Counts.get('numberOfEvents');
                }
            });

            this.addEvent = () => {
                this.newEvent.owner = Meteor.user()._id;
                Events.insert(this.newEvent);
                this.newEvent = {};
            };

            this.removeEvent = (event) => {
                Events.remove({_id: event._id});
            };

            this.pageChanged = (newPage) => {
                this.page = newPage;
            };
        }
    }
});