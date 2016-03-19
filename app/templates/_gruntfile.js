var path = require('path');

module.exports = function(grunt){

	grunt.initConfig({
		pull : [],
		destination : "<%= dest %>",
		appPrefix : "<%= appPrefix %>",
		watch : {
			files : ["dist/ui_scripts/*.js","dist/ui_pages/__*.xhtml","dist/stylesheets/*.css"],
			tasks : ["push:<%%= folder %>:<%%= watch_file_name %>"]
		}
	});

	grunt.loadNpmTasks("grunt-servicenow");
	grunt.loadNpmTasks("grunt-contrib-watch")
};
