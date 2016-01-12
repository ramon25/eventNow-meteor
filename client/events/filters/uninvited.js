angular.module('eventNow').filter('uninvited', function () {
    return function (users, event) {
        if (!event) {
            return false;
        }

        return _.filter(users, function (user) {
            return !(user._id == event.owner || _.contains(event.invited, user._id));
        });
    }
});