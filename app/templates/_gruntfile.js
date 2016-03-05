module.exports = function(grunt){

	grunt.initConfig({
		pull : [],
		destination : "<%= dest %>",
		appPrefix : "<%= appPrefix %>"
	});

	grunt.loadNpmTasks("grunt-servicenow");
};
