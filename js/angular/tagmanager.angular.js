var taManager = angular.module('taManager', []);

taManager.directive('tagManager', function() {
    return {
        restrict:'E',
        scope:{
            tags: '=ngModel'
        },
        replace:true,
        template:'<div class="tagManager">' +
            '<span class="label label-inverse" style="text-align:inline; margin-right:3px;" ng-repeat="tag in tags">{{tag}}</span>' +
            '<input type="text" ng-model="tagField"  placeholder="Enter , separated tags" style="vertical-align: baseline;"/>' +
            '</div>',

        link: function(scope, element, attrs) {
            // Watching update on tagField to handle new comma input
            scope.$watch('tagField', function(value){
                if (value!= null && value.indexOf(',') > 0) {
                    var values = value.split(',').filter(function (currentVal) {return currentVal.trim().length > 0});

                    angular.forEach(values, function(element) {
                        scope.tags.push(element);
                    });

                    scope.tagField='';

                }
            })

            // Registering event on backspace or lost focus
            $(element).first('input')
                // On backspace load the previous tag into tagField input
                .keyup(function(e){
                if(e.keyCode == 8){
                    scope.$apply(function() {
                        if (scope.tagField=='') {
                        scope.tagField = scope.tags.pop();
                        }
                    });
                }
                })
                // On lost focus -> add current tagfield content into tags array
                .focusout(function() {
                    scope.$apply(function() {
                        if (scope.tagField.trim().length > 0) {
                            scope.tags.push(scope.tagField.trim());
                            scope.tagField = '';
                        }
                    });
                })
        }
    }
});