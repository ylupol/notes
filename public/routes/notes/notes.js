module.controller("NotesController", function($scope, $http, $routeParams, $location) {
    $scope.notes = [];

    $scope.activeSection = $routeParams.section;

    var update = function() {
        $http.get("/notes", {params : {section: $scope.activeSection}})
            .success(function (notes) {
                $scope.notes = notes;
            });
    };

    $scope.add = function() {
        if ($scope.text.length == 0) return;
        var note = {text: $scope.text};
        note.section = $scope.activeSection;
        note.tags = $scope.tags;
        $http.post("/notes", note).success(function() {
            $scope.text = "";
            update();
        })
    };

    $scope.remove = function(id) {
        $http.delete("/notes", {params: {id:id}}).success(function() {
            update();
        });
    };

    var readSections = function() {
        $http.get("/sections").success(function(sections) {
            $scope.sections = sections;
            if ($scope.sections.length > 0) {
                $scope.activeSection = $routeParams.section;
            }
            update();
        });
    };

    readSections();

    $scope.showSection = function(section) {
        $scope.activeSection = section.title;
        update();
        $location.path(section.title);
    }

    $scope.withSections = function() {
        if ($scope.sections && $scope.sections.length > 0) {
            $http.post("/sections/replace", $scope.sections);
        }
    };

    $scope.addSection = function() {
        if ($scope.newSection.length == 0) return;

        // check for duplicates
        for (var i = 0; i < $scope.sections.length; i++) {
            if ($scope.sections[i].title = $scope.newSection) {
                return;
            }
        }

        var section = {title: $scope.newSection};
        $scope.sections.unshift(section);
        $scope.activeSection = $scope.newSection;
        $scope.newSection = "";
        $scope.writeSections();
        update();
    };

    update();
});