//bootstrap.js


//Configuration
var domainUrl = 'http://127.0.0.38/';
var themeDir = '';

//Include stack.
var libraries = [
	'scripts/plugins/validator.js',
];

var components = [
	'scripts/routes.js',
	'scripts/requests.js',
	'scripts/plugins.js',
	'scripts/helpers.js'
];

//Background task interval.
var heartbeat = 5000;

jQuery(document).ready(function()
{
	//Twoshoes pathing.
	jQuery(window).on('hashchange', (function()
	{
		Twoshoes.paths();
	}));

	//Top initiatisation.
	Twoshoes.init(
	{
		debugging : true,
		background : heartbeat,
		console : [Twoshoes.debugError]
	});

	Twoshoes.loadScripts(components, domainUrl+themeDir, false);
	//Twoshoes.request('bootstrap').init({complete:test});

    var template = jQuery('#index-page').html();
    var data = {};
    var html = Mustache.to_html(template, data);
    jQuery('#main_pane').html(html);

/*
TABLES

projects
tags
users
categories
*/

});
