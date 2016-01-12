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
            this.orderProperty = '1';
            this.searchText = '';

            this.subscribe('users');
            this.subscribe('events', () => {
                return [
                    {
                        limit: parseInt(this.perPage),
                        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
                        sort: this.getReactively('sort')
                    },
                    this.getReactively('searchText')
                ]
            });

            this.helpers({
                events: () => {
                    return Events.find({}, { sort : this.getReactively('sort') });
                },
                users: () => {
                    return Meteor.users.find({});
                },
                eventsCount: () => {
                    return Counts.get('numberOfEvents');
                }
            });

            this.updateSort = () => {
                this.sort = {
                    name: parseInt(this.orderProperty)
                }
            };

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

            this.getEventCreator = function(event){
                if (!event) {
                    return '';
                }

                let owner = Meteor.users.findOne(event.owner);

                if (!owner) {
                    return 'nobody';
                }

                if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
                    return 'me';
                }

                return owner;
            };

            this.rsvp = (eventId, rsvp) => {
                Meteor.call('rsvp', eventId, rsvp, (error) => {
                    if (error) {
                        console.log('Oops, unable to rsvp!');
                    }
                    else {
                        console.log('RSVP Done!');
                    }
                });
            };

            this.getUserById = (userId) => {
                return Meteor.users.findOne(userId);
            };

            this.outstandingInvitations = (event) => {
                return _.filter(this.users, (user) => {
                    return (_.contains(event.invited, user._id) && !_.findWhere(event.rsvps, {user: user._id}));
                });
            };
        }
    }
});