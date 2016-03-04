module.exports = function(grunt){
	var snConfig = grunt.file.readJSON('.sn-config.json');

	grunt.initConfig({
		pull : snConfig.folders,
		destination : "<%= dest %>",
		appPrefix : "<%= appPrefix %>"
	});

	grunt.loadNpmTasks("grunt-servicenow");
};
