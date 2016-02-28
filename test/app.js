'use strict';
var assert = require('yeoman-assert');

describe('SNOW Generator load test', function(){
	it("can be imported without blowing up", function(){
		assert(require('../app') !== undefined);	
		assert(require('../page') !== undefined);	
		assert(require('../sass') !== undefined);	
		assert(require('../script') !== undefined);	
		assert(require('../style') !== undefined);	
	});
});
