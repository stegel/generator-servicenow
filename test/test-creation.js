/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe("creates files", function(){
		beforeEach(function (done){
			helpers.testDirectory(path.join(__dirname, 'temp'), function(err){
				if(err){
					return done(err);
				}
				
				this.app = helpers.createGenerator('snow:app',['../../app']);
				
				done();
			}.bind(this));
		});
		
		it("creates expected files", function(done){
			this.timeout(15000);
			helpers.mockPrompt(this.app,{
				hostname : "empasiegel1",
				username : "testSnow",
				password : "testSnow",
				solution : "testSnow"
			});
				
			this.app.run({}, function() {
				helpers.assertFile('package.json');
				done();
			});
		});
	});