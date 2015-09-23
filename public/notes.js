var module = angular.module("myapp", ['dndLists']);
module.controller("NotesController", function($scope, $http) {
    $scope.notes = [];

    var update = function(params) {
        $http.get("/notes", params)
            .success(function (notes) {
                $scope.notes = notes;
            });
    };

    $scope.add = function() {
        if ($scope.text.length == 0) return;
        var note = {text: $scope.text};
        note.section = $scope.activeSection;
        note.tags = $scope.tags;
        $http.post("/notes", note).success(function(){
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
                $scope.activeSection = $scope.sections[0].title;
            }
            update();
        });
    };

    readSections();

    $scope.showSection = function(section) {
        $scope.activeSection = section.title;
        update();
    }

    $scope.withSections = function() {
        if ($scope.sections && $scope.sections.length > 0) {
            $http.post("/sections/replase", $scope.sections);
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