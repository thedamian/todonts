// # Todolist: AngularJS Version

// ## **App Module**

angular.module('TodoList', []);

// ## **Note Controller**

(function() {
  'use strict';

  angular.module('TodoList')
    .controller('NoteCtrl', NoteCtrl);

  NoteCtrl.$inject = ['$scope'];

  function NoteCtrl($scope,$http) {
    var self = this;

    // ** Initialize LocalStorage**
    function initializeLS() {

      // Set scope's localStorage reference window.localStorage - ng-repeat in the HTML uses localStorage to display the Sticky Notes
      self.localStorage = window.localStorage;

      // Delete anything from localStorage that is not related to the StickyNotes app. This is because localStorage is used by ng-repeat to display the notes, and would throw an error if we had anything else otherwise.
      for (var prop in window.localStorage) {
        if (String(Number(prop)) === 'NaN') {
          delete window.localStorage[prop];
        }
      }

      // Set the ID of the next Sticky Note to be added.
      self.currentId = Math.max.apply(null, Object.keys(window.localStorage).map(function(val) {
        return parseInt(val);
      })) + 1;

      // If there are no Sticky Notes currently, set the currentID to be 0.
      self.currentId = (self.currentId === -Infinity) ? 0 : self.currentId;
    }

    initializeLS();

    // ** CRUD Methods for Sticky Notes **

    // Add Sticky Note by attaching the premade-string to localStorage with a unique ID.
    self.addSticky = function() {
        $http.get("http://www.omdbapi.com/?t=" + $scope.search + "&tomatoes=true&plot=full")
        .then(function(response){ $scope.details = response.data; });


      window.localStorage[self.currentId++] = initialStrings[self.currentId % initialStrings.length];
    };

    // Update LocalStorage if a user changes a sticky note (using ng-change, so that all changes are immediately bound to LS).
    self.updateLS = function(str, elemID) {
      window.localStorage[elemID] = str;
    };

    // Delete note in LocalStorage if a user clicks on the delete button.
    self.deleteSticky = function(elemID, elem) {
      delete window.localStorage[elemID];
    };

    // Delete all notes on the page by emptying out localStorage.
    self.deleteAll = function() {
      for (var prop in window.localStorage) {
        delete window.localStorage[prop];
      }
    };

    // Initial strings to populate the Sticky Notes.
    var initialStrings = ["aaaa",
      "bbb",
      "ccc"
    ];
  }

})();

// ## **Custom Directive to auto-resize `textarea`.**

// A custom directive to resize `textarea` based on `scrollHeight`. Since there is no easy way to resize `textarea` by CSS only, and DOM manipulation within controllers is frowned upon, I created a directive and attached to `textarea` tags to resize it.

(function() {
  'use strict';

  angular.module('TodoList')
    .directive('autoresize', autoresize);

  function autoresize() {
    var directive = {
      link: link
    };

    return directive;

    function link(scope, elem, attrs) {

      var adjustHeight = function() {
        var scrollHeight = elem[0].scrollHeight;
        elem.css('height', scrollHeight + "px");
      };

      // Adjust height whenever `textarea` is inputted or focused.
      elem.bind('input focus', adjustHeight);

      // Adjust height as soon as app is loaded.
      scope.$watch(['$viewContentLoaded'], adjustHeight);
    }
  }
})();