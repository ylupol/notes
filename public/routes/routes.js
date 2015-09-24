var module = angular.module("myapp", ['dndLists', 'ngRoute']);

module.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/register', {
                templateUrl: 'routes/userForm/userForm.html',
                controller: 'UserFormController'
            }).
            when('/:section?', {
                templateUrl: 'routes/notes/notes.html',
                controller: 'NotesController'
            }).
            when('/:section/:name', {
                templateUrl: 'routes/viewSection/viewSection.html',
                controller: 'ViewSectionController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);


