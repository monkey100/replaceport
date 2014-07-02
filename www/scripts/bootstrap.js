//bootstrap.js

//Configuration
var domainUrl = 'http://127.0.0.38/';
var themeDir = '';

//Include stack.
var libraries = [
	'scripts/plugins/navigation.js',
	'scripts/plugins/validator.js',
];

var components = [
	'scripts/routes.js',
	'scripts/requests.js',
	'scripts/tables.js',
	'scripts/plugins.js',
	'scripts/helpers.js',
	'scripts/helpers/dom.js',
	'scripts/helpers/time.js',
	'scripts/helpers/project.js'
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

	Twoshoes.loadScripts(libraries, domainUrl+themeDir, false);
	Twoshoes.loadScripts(components, domainUrl+themeDir, false);
	Twoshoes.request('bootstrap').init({});
});
