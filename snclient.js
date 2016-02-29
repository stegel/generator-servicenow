"use strict";
var restler = require('restler');
var snClient = restler.service(
	function(config){
		this.config = config;
		
		if(config.authType === "OAuth v2")
		{
			this.defaults.accessToken = config.accessToken;

		}
		else{
		
			this.defaults.username = config.authHash.substring(0,config.authHash.indexOf(":"));
			this.defaults.password = config.authHash.substring(config.authHash.indexOf(":")+1);
		
		}
		
		this.defaults.headers = {
			'Content-Type': 'application/json',
			'Accepts': 'application/json'
		};
		this.baseURL = config.endpoint;

		
	},
	{
		
	},
	{
		getRecord : function(table,query){
			return this.get(this.baseURL + "/table/" + table + '?sysparm_query=' + query);
		},
		postRecord : function(table,data){
			return this.post(this.baseURL + "/table/" + table,{
				data : JSON.stringify(data)
			});
		},

	});
module.exports = snClient;
