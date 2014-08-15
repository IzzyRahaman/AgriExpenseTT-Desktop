var app = angular.module('UserManagementApp', [])

app.service('UserInsertionService', ['$http', function ($http) {

    this.create_user = function (first_name, last_name, location, password, fn) {
        var url = "http://127.0.0.1:5555/register/new";
        var options = {
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                firstName: first_name,
                lastName: last_name,
                location: location,
                password: password
            })
        };

        $http(options).success(fn);

    }

}]);

/*
app.service('UserAuthenticationService'['$http', function ($http) {

    this.request_validation_for_user = function (first_name, last_name, password, fn) {

        var url = "http://127.0.0.1:5555/authenticate";
        var option = {
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                firstName: first_name,
                lastName: last_name,
                password: password
            })
        };

        $http(option).success(fn);

    }

}]); */

app.controller('MyUserController', ['$scope', 'UserInsertionService',
    function ($scope, UserInsertionService) {

        $scope.locations = ['Caroni', 'Mayaro', 'Nariva', 'Saint Andrew', 'Saint David',
                'Saint George', 'Saint Patrick', 'Victoria'];
        $scope.firstName = "";
        $scope.lastName = "";
        $scope.password = "";
        $scope.retypedPassword = "";
        $scope.location = $scope.locations[0];

        $scope.reset_variables = function () {
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.password = "";
            $scope.retypedPassword = "";
            $scope.location = $scope.locations[0];
        }

        $scope.create_user = function () {
            console.log('Trying to create user');
            console.log($scope.location);
            /*
            UserInsertionService.create_user($scope.firstName, $scope.lastName,
                $scope.location, $scope.password, function (data) {
                    $scope.reset_variables();

            }); */

        }

        $scope.request_validation_for_user = function () {
            UserAuthenticationService.request_validation_for_user(firstName, lastName, password, function (d) {

            })
        }

}]);