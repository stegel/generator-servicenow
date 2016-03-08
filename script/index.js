'use strict';

var yeoman = require('yeoman-generator').Base,
	yosay = require('yosay'),
	util = require('util'),
	path = require('path'),
	_ = require('underscore.string'),
	require_config = require('../helpers/config-validator.js');


var Generator = module.exports = function Generator(args, options){
	yeoman.apply(this, arguments);

	this.argument('filename', {type: String, required :true});


	this.filename = _.camelize(_.slugify(_.humanize(this.filename)));

	this.pkg = require("../package.json");
};

util.inherits(Generator, yeoman);

Generator.prototype.welcome = function welcome(){
	if(!this.options['skip-welcome-message']){
		this.log(yosay("We're going ahead a creating a new script under dist/ui_scripts"));
	}
};

Generator.prototype.copying = function copying(){
	var done = this.async();
	var _this = this;
	require_config().then(function(config){

		_this.template("_script.js","dist/ui_scripts/" + config.project_prefix + _this.filename + ".js");
		done();
	});


}
