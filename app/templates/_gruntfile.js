module.exports = function(grunt){
	var snConfig = grunt.file.readJSON('.sn-config.json');

	grunt.initConfig({
		pull : snConfig.folders,
		destination : "<%= dest %>"
	});

	grunt.loadNpmTasks("grunt-servicenow");
};
