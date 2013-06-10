var taManager = angular.module('tagManager', []);

taManager.directive('tagManager', function() {
    return {
        restrict:'E',
        scope:{
            tags: '=ngModel'
        },
        replace:true,
        template:'<div class="tagManager">' +
            '<span class="label label-inverse" style="text-align:inline; margin-right:3px;" ng-repeat="tag in tags">{{tag}} <a ng-click="removeTag(tag)" alt="Remove tag">&times;</a></span>' +
            '<input type="text" ng-model="tagField"  placeholder="Enter , separated tags" style="vertical-align: baseline;"/>' +
            '</div>',

        link: function(scope, element, attrs) {
            scope.tagField = '';

            // Watching update on tagField to handle new comma input
            scope.$watch('tagField', function(value){
                if (value!= null) {
                    values = value.split(/[,;\s]/);
                    if (values.length > 1) {
                        while (values.length>1) {
                            scope.addTag(values.shift());
                        }
                        scope.tagField=values.pop();
                    }



                }
            });

            // Remove a tag
            scope.removeTag = function(tag) {
                scope.tags = scope.tags.filter(function(currentTag){
                    return currentTag.toLowerCase() != tag.toLowerCase();
                });
            };

            // Add a tag
            scope.addTag = function(tag){
                // Remove previous occurence if exists (avoid duplicated tag)
                scope.removeTag(tag);
                // Add tag to tagList
                scope.tags.push(tag);
            }

            // switch tag from tagField to TagList
            scope.switchToTagList = function(){
                scope.$apply(function() {
                    if (scope.tagField.trim().length > 0) {
                        scope.addTag(scope.tagField.trim());
                        scope.tagField = '';
                    }
                });
            }

            // Registering event on backspace, enter or lost focus
            element.find('input')
                .bind("keydown", function(e){
                // On backspace load the previous tag into tagField input
                if(e.keyCode == 8){
                    scope.$apply(function() {
                        if (scope.tagField=='') {
                        scope.tagField = scope.tags.pop();
                        }
                    });
                // On Enter switch tag to taglist
                }else if(e.keyCode == 13){
                    scope.switchToTagList();
                    }
                })
                // On lost focus -> add current tagfield content into tags array
                .bind("focusout", function(e){
                    scope.switchToTagList();
                    }
                );
        }
    }
});
