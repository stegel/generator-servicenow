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

	grunt.event.on('watch', function(action, filepath) {

		grunt.config("folder",path.relative(path.join(process.cwd(),"dist"),path.dirname(filepath)));
		grunt.config("watch_file_name",path.basename(filepath,path.extname(filepath)).replace(grunt.config("appPrefix"),""));
	});

	grunt.loadNpmTasks("grunt-servicenow");
	grunt.loadNpmTasks("grunt-contrib-watch")
};
