'use strict';

var yeoman = require('yeoman-generator'),
	yosay = require('yosay'),
	rest = require('restler'),
	mkdirp = require('mkdirp'),
	util = require('util'),
	path = require('path'),
	jsonfile = require('jsonfile'),
	_ = require('underscore.string'),
	SnClient = require("../helpers/snclient.js");

var Generator = module.exports = function Generator(args, options){
	yeoman.generators.Base.apply(this, arguments);

	this.argument('appname', {type: String, required :false});

	this.appname = this.appname || path.basename(process.cwd());

	this.appname = _.camelize(_.slugify(_.humanize(this.appname)));

	this.on('end', function () {
		console.log("hey");
		this.npmInstall();
	}.bind(this));

	this.pkg = require("../package.json");
//	this.sourceRoot(path.join(__dirname, '../templates/common'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome(){
	if(!this.options['skip-welcome-message']){
		this.log(yosay());
	}
};

Generator.prototype.askForHostname = function askForHostname(){
	var done = this.async();

	this.prompt([{
		type : 'input',
		name : 'hostname',
		message : 'What instance are you on? (the part before .service-now.com)',
		default : 'scdevelopment'
	}], function(props){
		this.hostname = props.hostname;
		done();
	}.bind(this));
};

Generator.prototype.askForUsername = function askForUsername(){
	var done = this.async();

	this.prompt([{
		type : 'input',
		name : "username",
		message : "What is your username?",
	}], function(props){
		this.username = props.username;
		done();
	}.bind(this));
};

Generator.prototype.askForPassword = function askForPassword(){
	var done = this.async();

	this.prompt([{
		type : 'password',
		name : "password",
		message : "What is your password?",
	}], function(props){
		this.password = props.password;
		this.authHash = new Buffer(this.username + ":" + this.password).toString("base64");
		done();
	}.bind(this));
};

Generator.prototype.askForPrefix = function askForPrefix(){
	var done = this.async();

	this.prompt([{
		type : 'input',
		name : 'appPrefix',
		message : 'What is your app prefix?',
		default : 'solution'
	}], function(props){
		this.appPrefix = props.appPrefix;
		
		done();
	}.bind(this));

};

Generator.prototype.askForDest = function askForDest(){
	var done = this.async();

	this.prompt([{
		type : 'input',
		name : 'appDest',
		message : 'Where do you want to store your app files?',
		default : 'dist'
	}], function(props){
		this.appDest = props.appDest;

		done();
	}.bind(this));
	
};

Generator.prototype.saveConfig = function saveConfig(){
	this.template("_sn-config.json",".sn-config.json",{
		host : this.hostname,
		auth : this.authHash,
		prefix : this.appPrefix,
		dest : this.appDest
	});
};

Generator.prototype.setupPackage = function setupPackage(){
	this.template("_package.json", "package.json",{
		appName : this.appname
	});
};

Generator.prototype.setupGrunt = function setupGrunt(){
	this.template("_gruntfile.js", "Gruntfile.js",{
		dest : this.appDest,
		appPrefix : this.appPrefix
	});
};
