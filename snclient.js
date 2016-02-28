"use strict";
var restler = require('restler');
var snClient = restler.service(
	function(config){
		this.defaults.username = config.username
		this.defaults.password = config.password;
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
		}
	});
module.exports = snClient;