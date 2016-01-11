angular.module('eventNow').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('events', {
                url: '/events',
                template: '<events-list></events-list>'
            })
            .state('eventDetails', {
                url: '/events/:eventId',
                template: '<event-details></event-details>',
                resolve: {
                    currentUser: ($q) => {
                        if (Meteor.userId() == null) {
                            return $q.reject('AUTH_REQUIRED');
                        }
                        else {
                            return $q.resolve();
                        }
                    }
                }
            });

        $urlRouterProvider.otherwise("/events");
    })
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error === 'AUTH_REQUIRED') {
                $state.go('events');
            }
        });
    });
