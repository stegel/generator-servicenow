(function(){
	var app = angular.module("<%= appName %>")
	.directive("<%= directiveName %>",function(){
		return {
			restrict : 'E',
			templateUrl : 'community__template_<%= directiveName %>.do',
			controller : function($scope){
			}
		}

	});
})();
