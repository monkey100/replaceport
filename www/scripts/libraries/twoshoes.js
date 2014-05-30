// twoshoes.js

jQuery.noConflict();

var Twoshoes = {

	//Configuration settings.
	config 						: {},
	//Global value accessor.
	values						: {},

	//*!*I need to test the property defined in the int.config and if it is false then remove all debuggin levels
	console						: [],
	debugging					: false,
	debugRoute					: 1,
	debugRequest				: 2,
	debugTable					: 4,
	debugWidget					: 8,
	debugPlugin					: 16,
	debugBuild					: 32,
	debugQuery					: 64,
	debugError					: 128,

	//This control the object chaining - not using these?
	eventType					: false,
	eventName					: false,
	buildType					: false,
	buildName					: false,

	//Event controllers.
	pathRegistry				: {}, //this is the destination of pathed routes
	eventRegistry 				: {}, //this is the final destination of the events which are bound to their handlers
	valueRegistry				: {}, //this is the final destination of dom elements which are holding table values
	pluginRegistry				: {}, //Destination of all plugins
	requestRegistry				: {}, //*!*not sure this is needed, but i have fucked up the initial request building logic.

	//Number of milliseconds between each background task. Zero to turn off.
	backgroundPeriod			: 5000,

	//Holder for the route behaviour.
	behave						: {},

	//Route event handles.
	routeEvents					: ['click', 'focusin', 'focusout', 'keypress', 'hover', 'keydown', 'keyup', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'resize', 'change'],

	//Holder for table query.
	query						: {},

	//Table method names.
	tableActions				: ['select', 'insert', 'update', 'remove', 'link'],

	//Object serialisation tokens and tags.
	objectTokens				:
	{
		open 					: 'T_OPENOBJECT',
		close 					: 'T_CLOSEOBJECT',
		position				: 'T_SPLITPOSITION',
		property 				: 'T_SPLITPROPERTY',
		string 					: 'T_SPLITSTRING',
		value 					: 'T_SPLITVALUE'
	},

	objectTags					:
	{
		open 					: '{',
		close 					: '}',
		position				: ';',
		property 				: ':',
		string 					: '"'
	},

	//BUILDER PROCESS AND STACK HOLDERS
	//Output controllers.
	buildTemplate				: false,
	buildValues					: false,

	template					: '',
	bound						: [],

	templateBuildTokens			: false,
	templateBuildStrings		: false,

	//Build tokens
	templateTokens						:
	{
		open					: 'TOK_OPEN',
		close					: 'TOK_CLOSE',
		string					: 'TOK_STRING',
		variable				: 'TOK_VARIABLE',
		ifOpen					: 'TOK_IF_OPEN',
		elseOpen				: 'TOK_ELSE_OPEN',
		ifClose					: 'TOK_IF_CLOSE',
		eachOpen				: 'TOK_EACH_OPEN',
		eachClose				: 'TOK_EACH_CLOSE',
		comment					: 'TOK_COMMENT',
		escape					: 'TOK_ESCAPE'
	},

	//Query regex holders.
	regexQuerySplit				: '',
	regexQueryType				: '',
	regexEvaluate				: '',
	regexNamespace				: '',

	//Build regex holders.
	regexBuildFold				: '',
	regexOpen					: '{',
	regexClose					: '}',
	regexVariable				: '',
	regexVariableLabel			: '',
	regexVariableKey			: '',
	regexVariableFunc			: '',
	regexIfOpen					: '',
	regexIfClose				: '',
	regexEachOpen				: '',
	regexEachClose				: '',
	regexPlaceholder			: '%',

	//Build all regular expressions used in tempating.
	folds : function()
	{
		//this.regexVariable = '(jQuery([\w]*)+([\s])*([^'+this.regexClose+'])*)';
		Twoshoes.regexVariable = '(\\{){1}([\\s])*(\\$){1}([^}]+)*(\\}){1}';
		Twoshoes.regexVariableLabel = 'jQuery([\w]*)';
		Twoshoes.regexVariableKey = '';
		Twoshoes.regexVariableFunc = '[^'+Twoshoes.regexClose+'])*';
		Twoshoes.regexIfOpen = '(if([^'+Twoshoes.regexClose+'])*)';
		Twoshoes.regexElseOpen = '(else([^'+Twoshoes.regexClose+'])*)';
		Twoshoes.regexIfClose = '(\/if([^'+Twoshoes.regexClose+'])*)';
		Twoshoes.regexEachOpen = '(each((jQuery)*[\w])+([\s]+)([\w\[\]\jQuery])*(as)*([\w\[\]\jQuery])*(on)*([\w\[\]\jQuery])*(count)*';
		Twoshoes.regexEachClose = '(\/each([^'+Twoshoes.regexClose+'])*)';
		Twoshoes.debug('tokens.regexEachOpen', Twoshoes.regexEachOpen, Twoshoes.debugBuild);

		var buildSlit = Twoshoes.regexVariable;
		Twoshoes.regexBuildFold = new RegExp(buildSlit, 'g');//combine all stack tokens

		Twoshoes.regexName = /([a-zA-Z0-9])+/;
		Twoshoes.regexWhitespace = /([\s]+)/;
		//this.debug('(Q)tokens.regexWhitespace', this.regexWhitespace, this.debugQuery);
	},

	//Sets configuration data to the Twoshoes global object
	// - config:			Configuration object
	// * Return:			SELF
	init : function(config)
	{
		//Build object values.
		Twoshoes.folds();

		//Get current configuration as an array.
		var groups = [];
		for (var group in Twoshoes.config)
		{
			groups.push(group);
		}

		//Set the configuration.
		if (config)
		{
			//Set debugging.
			if (config.debugging)
			{
				Twoshoes.debugging = config.debugging;
			}

			for (var level in config.console)
			{
				Twoshoes.console.push(config.console[level]);
			}

			//Setup background tasks.
			if (typeof config.background != 'undefined')
			{
				if ((config.background != 0) && (config.background != false))
				{
					if (!Twoshoes.isInteger(config.background))
					{
						//do error, value not an int
						Twoshoes.backgroundPeriod = 0;
					}
					else
					{
						Twoshoes.backgroundPeriod = config.background;
					}
				}
				else
				{
					Twoshoes.backgroundPeriod = 0;
				}
			}

			//Validate each configuration setting.
			for (var group in config)
			{
				//If group does not exist create it.
				if (groups.indexOf(group) == -1)
				{
					Twoshoes.config[group] = {};
				}

				//Need to check for false value in config to remove this group
					//Do the same thing for individually named properties in groups.

				//Set configuration group by label.
				//I beieve this creating duplication
				//Also, I'm using registries so this is putting alot of duplication into memory
				for (var label in config[group])
				{
					if (Twoshoes.validateConfig(group, label, config[group][label]))
					{
						//I would like to set this up as Twoshoes.group.label without the config
						Twoshoes.config[group][label] = config[group][label];
					}
				}
			}
		}

		//everyting from here in should call this.config so init() can be called again with new config settings to add
		//additional functions to replace or modify named routes
		//Add event handlers.
		//*!*Need to test all the event types because there is somesort of conflict going on with the blur which could mean other events are fucked.
		//*!*NB: I need to clear out the event registry if that namespace exists already.
		//refactor variable eventList
		//*!*Bug with handle property. Event should be set regardless of handle property and tested on the trigger. This doesn't seem to be happening
		//Not having the handle at ths step drops that element out of the trigger dispatch test.
		var eventsList = ['click', 'focusin', 'focusout', 'keypress', 'hover', 'keydown', 'keyup', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'resize', 'change'];
		var eventsList = Twoshoes.routeEvents;
		for (var i = 0, j = eventsList.length; i < j; i++)
		{
			(function (n)
			{
			   	//var indexes = 0;
				//var triggers = {}; //To be replaced by the eventRegistry
				var builder = Twoshoes.getShortSelector;

				for (var group in config.routes)
				{
					var index = 0;
					//Get the number of indexes in the registry.
					if (typeof Twoshoes.eventRegistry[eventsList[n]] == 'undefined')
					{
						Twoshoes.eventRegistry[eventsList[n]] = {};
					}

					(function ()
					{
						for (var route in config.routes[group])
						{
							(function()
							{
								//If the route event matches the event type add route.
								if ((typeof config.routes[group][route].event != 'undefined')
								&& (config.routes[group][route].event == eventsList[n]))
								{
									//Create event grup if it doesn't exist.
									if (typeof Twoshoes.eventRegistry[eventsList[n]][group] == 'undefined')
									{
										Twoshoes.eventRegistry[eventsList[n]][group] = {};
									}

									//Add event to registry if it is not defined.
									//if this doesn't equal undefined there should be some override option
									if (typeof Twoshoes.eventRegistry[eventsList[n]][group][route] == 'undefined')
									{
										Twoshoes.eventRegistry[eventsList[n]][group][route] = config.routes[group][route];
									}
								}
							})(route);
						}
					})(group);
				}

				//I have not checke for the existance of the dispatch property.
				//Should do a full property check within this routine.

				//Set event delegation by type.
				//*!*Not sure if this test is supported by all browsers, will have to test later
	 			if (Twoshoes.isObject(Twoshoes.eventRegistry[eventsList[n]])
				&& (Object.keys(Twoshoes.eventRegistry[eventsList[n]]).length > 0))
	 			{
					//Reset event handling.
					if (eventsList[n] == 'resize')
					{
						jQuery(window).off();
						//*!* the n and i need to be reconcilled!!!!
						jQuery(window).on(eventsList[n], {type:eventsList[i], routes:Twoshoes.eventRegistry[eventsList[n]], builder:builder}, Twoshoes.dispatch);
					}
//NB: hover event needs to use in the "on" function the first parameter "mouseenter mouseleave".
//This needs to be ested to confirm the correct usage.
					else if (eventsList[n] == 'hover')
					{
						jQuery(document).off();
						jQuery(document).on("mouseenter mouseleave", {type:eventsList[i], routes:Twoshoes.eventRegistry[eventsList[n]], builder:builder}, Twoshoes.dispatch);
					}
					else if (eventsList[n] == 'change')
					{
						//This is here because of plugin conflicts, must test as this is basically a poor workaround for
						//an event which cannot be attached to the document object and uses psuedo-bubbling which is broken
//						jQuery(document).off();
						jQuery(document).on(eventsList[n], {type:eventsList[i], routes:Twoshoes.eventRegistry[eventsList[n]], builder:builder}, Twoshoes.dispatch);
					}
					//jQuery(document).off(); is screwing up the execution of some event code
					else if (eventsList[n] == 'focusout')
					{
//						jQuery(document).off();
						jQuery(document).on(eventsList[n], {type:eventsList[i], routes:Twoshoes.eventRegistry[eventsList[n]], builder:builder}, Twoshoes.dispatch);
					}
					else if (eventsList[n] == 'focusin')
					{
//						jQuery(document).off();
						jQuery(document).on(eventsList[n], {type:eventsList[i], routes:Twoshoes.eventRegistry[eventsList[n]], builder:builder}, Twoshoes.dispatch);
					}
					else
					{
						jQuery(document).off();
						jQuery(document).on(eventsList[n], {type:eventsList[i], routes:Twoshoes.eventRegistry[eventsList[n]], builder:builder}, Twoshoes.dispatch);
					}
				}
			})(i);
		}

		//Set request actions.
		//*!*This entire thing is fucked. this assumes that he requests are automatically handled by the form submission event
		//which is an incorrect assumption. I'm forking from this and getting back to fixing this at some
		//later point in time. The requests are going to be run through the Twoshoes.request().handle() functionality
		//and not be automatcally fired. This will need to be tested to make sure the following code is not interfering
		//with anything else in the website interface.
		if (config.requests)
		{
			var triggers = {};
			var builder = Twoshoes.getShortSelector;
			for (var request in config.requests)
			{
				//Convert request config into dispatch function.
				triggers[request] = {
					event : 'submit',
					target : config.requests[request].target,
					dispatch : function(target){
						jQuery.ajax({
							method : config.requests[request].method,
							action : config.requests[request].action,
							data : jQuery(config.requests[request].target).serialize(),
							dataType : 'json',
							success : function (response)
							{
								config.requests[request].success();
							},
							error : function (response)
							{
								config.requests[request].error();
							}
						});
					},
				};
			}

			//Set delegation for form submits.
			Twoshoes.eventRegistry['submit'] = triggers;
			jQuery(document).on('submit', {routes:Twoshoes.eventRegistry['submit'], builder:builder}, Twoshoes.dispatch);
		}

		//Set the widgets.
		if (config.widgets)
		{
			for (var widget in config.widgets)
			{

			}
		}

		//Configure table data.
		//*!*This is the second time this data is being set.
		//Need to capture all table modificaions prior to overwriting to the tables so
		//any requests that are slow don't dop data out of the interface, which eans picking up
		//actions and dropping them no their tables for next background task to handle.
		//This is to be done later.
		//*!*validate and add any properties of the table whch are not included.
		//require properies - fields, values
		//optional preoperties - actions, defaults, filters, errors
		if (config.tables)
		{
			for (var table in config.tables)
			{
				//Set the table locally.
				(function()
				{
					//Twoshoes.valueRegistry[table] = config.tables[table]; // this needs to be activated to have a start point reference of table values
					Twoshoes.config.tables[table] = config.tables[table];
				})(table);
			}
		}

		//Add helperss to interface.
		if (config.helpers)
		{
			for (var helper in config.helpers)
			{

			}
		}

		//Add plugins to interface.
		if (config.plugins)
		{
			//*!*The only thing I need to do here s the require check
			for (var label in config.plugins)
			{
				(function(label)
				{
					//Register plugin.
					Twoshoes.pluginRegistry[label] = config.plugins[label];

					//If the target element exists call the plugin.
					if (jQuery(config.plugins[label].target).length > 0)
					{
						//*!*Need to make a note of this that is the pluginis supplied a property "callback" then this will be execued
						//Need to put a test in to check whenther this is a function or not.
 						if (config.plugins[label].hasOwnProperty('callback'))
 						{
							jQuery(config.plugins[label].target)[config.plugins[label].plugin](config.plugins[label].config, config.plugins[label].callback);
						}
						else
						{
							jQuery(config.plugins[label].target)[config.plugins[label].plugin](config.plugins[label].config);
						}
					}
				})(label);
			}
		}

		//Set the debugger.
		if (Twoshoes.console)
		{
			Twoshoes.debugging = true;
		}

		//Reset the query object.
		Twoshoes.query = {
        	table : '',
        	where : [],
        	order : [],
        	range : '', //*!*should this not be zero or false?
        	offset : '', //*!*should this not be zero?
        	extract : []
		}

		return this;
	},
	
	//Getter setter added for global data accessors
	//Gets the value property of Framework.values.name
	// - name:				Name of variable to get
	// * return:			Variable set to values property, false if doesn't exist
	get : function(name)
	{
		if (typeof Twoshoes.values[name] != 'undefined')
		{
			return Twoshoes.values[name];
		}

		return null;
	},

	//Sets the value to property of Framework.values.name
	// - name:				Name of variable to set
	// - value:				Value of variable to set
	// * return:			True if variable is not prviously set, false value in namespace already exists
	set : function(name, value)
	{
		var inNamespace = (typeof Twoshoes.values[name] != 'undefined')? true: false;
		Twoshoes.values[name] = value;
		return inNamespace;
	},

	//Executes all routes that match the location hash value of the window.
	// - match:					Regular espression to match for execution, not implemented yet
	// - groups: 				String of group names or an array of strings of the group names to execute the pathing on
	// - execute:				Number of matches parameter. Default true, execute all matches
	// - update:				Update plugins after paths have been fired. Default true, update after dispatches
	// * Return:				SELF
	//*!*Implement th match parameter, check the rest of the routines.
	paths : function(match, groups, execute, update)
	{
		//Validate the groups parameter.
		var testGroups = [];
		var filterByGroups = false;
		if (typeof groups != 'undefined')
		{
			filterByGroups = (groups == false)? false: true;
			if (Twoshoes.isString(groups))
			{
				testGroups.push(groups);
			}

			if (Twoshoes.isArray(groups))
			{
				testGroups = groups;
			}
		}

		//Go through each hashchange route and dispatch matching routes.
		for (var group in Twoshoes.config.routes)
		{
			(function()
			{
				//Check for group match for specified filter.
				if ((!filterByGroups) || (jQuery.inArray(group, testGroups) != -1))
				{
					for (var route in Twoshoes.config.routes[group])
					{
						(function()
						{
							if (typeof Twoshoes.config.routes[group][route].path != 'undefined')
							{
								var pathRegex = Twoshoes.config.routes[group][route].path;
								if (Twoshoes.isString(pathRegex))
								{
									pathRegex = new RegExp(pathRegex, 'g');
								}

								//If the path is a regex fire dispatch..
								if (Twoshoes.isRegExp(pathRegex))
								{
									var hashPath = location.hash.substr(1);
									if (hashPath.match(pathRegex))
									{
										//I will need to check for the required conditions before dispatching.
										//NB: These are not described at all yet, if they are to be implemented at all.
										if (typeof Twoshoes.config.routes[group][route].dispatch == 'undefined')
										{
											Twoshoes.debug('(E)Twoshoes.config.routes.'+group+'.'+route+'.dispatch', 'property not defined', Twoshoes.debugError);
										}
										else
										{
											//I will need to check for the required conditions before dispatching.
											//NB: These are not described at all yet, if they are to be implemented at all.
											Twoshoes.config.routes[group][route].dispatch();
										}
									}
								}
								//Otherwise handle error
								else
								{
									Twoshoes.debug('(E)Twoshoes.config.routes.'+group+'.'+route+' not a regex', pathRegex, Twoshoes.debugError);
								}
							}
						})(group, route)
					}
				}
			})(group);
		}

		//Update plugins for new inerface state.
		if ((typeof update != 'undefined') && (update == true))
		{
			Twoshoes.updatePlugins();
		}

		//*!*Update the path in the settings table, this might have to be optional.
		//I want to add a callback function for this.

		return this;
	},

	//Gets the path node value for the window location or other url.
	// - position:				Position in the path to get the node value
	// - value:					Replcement value of the node if it exists
	// * Return:				Path node at the given position if it exists, otherwise false
	//*!*Add a new parameter which is a string to update the node value(locaion.hash = '')
	//*!*Might add an additiona paramter to set the hash as a value(or use position = true)
	//*!*Might also cahnge the position to be like an array index usage, this way there is no conceptual conflict.
	node : function(position)
	{
		var posValue = '';

		if (!Twoshoes.isInteger(position))
		{
			if (Twoshoes.isString(position))
			{
				position = parseInt(position);
			}
			else
			{
				//do error
				return false;
			}
		}

		if ((location.hash == '') || (typeof location.hash == 'undefined'))
		{
			//do error
			return false;
		}

		var pathNodes = location.hash.substr(1).split('/');
		if (typeof pathNodes[position - 1] == 'undefined')
		{
			return false;
		}

		return pathNodes[position - 1];
	},

	//Replaces an event with route name on the event registry
	//*!*this might be an internal utility function
	replaceEvent : function()
	{

	},

	//*!*This doesn't seem to be used at all
	//Gets the route names of all events set on the registry
	// - eventType:					Type of registered event to get
	getRegisteredEvents : function(eventType)
	{
		//If the event type is defined get
		var eventRoutes = [];
		var eventIndex = 0;

		//If the event type is defined get events by type.
		if (typeof eventType != 'undefined')
		{
			if (typeof Twoshoes.eventRegistry[eventType] != 'undefined')
			{
				jQuery.each(Twoshoes.eventRegistry[eventType], function(route, properties)
				{
					eventRoutes[eventIndex] = route;
					eventIndex++;
				});
			}
			else
			{
				return false;
			}
		}
		//Otherwise get all event names.
		else
		{
			jQuery.each(Twoshoes.eventRegistry, function(index, value)
			{
				jQuery.each(value, function(route, properties)
				{
					eventRoutes[eventIndex] = route;
					eventIndex++;
				});
			});
		}

		return eventRoutes;
	},

	//Resets data which has been set to the element.
	// - target:			DOM element Sizzle selector string to clear variables held against it
	// * NB: This helps to clear the modified event trigger behaviour but, will override custom data.
	//Will probably need to set internally defined constants so I don't clear user defined values which would break functionality.
	//This is being used to reset plugins configured to an element
	resetData : function(target)
	{
		//*!*quik hack for now. should run a loop of framework defined variables.
		if (jQuery(target).data('value'))
		{
			jQuery(target).data('value', '');
		}
	},

	//Dispatch events through config delegation.
	// - event:				jQuery event object, properties are set when event registry is built and processed
	// * Return:			VOID
	//*!*Callback needds to be added
	dispatch : function(event)
	{
		var target = event.target;

		//Loop through each route to find matching target.
		for (var group in event.data.routes)
		{
			(function()
			{
				Twoshoes.debug('(R)dispatch.event.data.group', group, Twoshoes.debugRoute);

				for (var route in event.data.routes[group])
				{
					(function()
					{
						Twoshoes.debug('(R)dispatch.event.data.group.route', route, Twoshoes.debugRoute);

						var targetSelector = event.data.builder(event.data.routes[group][route].target);
						var isTarget = false;
						if (!Twoshoes.isWindow(targetSelector))
						{
							//Twoshoes.isShortSelector is supplied as the builder not sure what it is doing here, need to test.
							isTarget = Twoshoes.isShortSelector(target, targetSelector);
						}
						else
						{
							isTarget = true;
						}

						//If there is a matching target get the handler.
						if (isTarget)
						{
							//Validate target handle option if it exists.
							var triggerEvent = false;
							if ((typeof event.data.routes[group][route].handle != 'undefined')
							&& (event.data.routes[group][route].handle))
							{
								var handleSelector = event.data.builder(event.data.routes[group][route].handle);
								triggerEvent = Twoshoes.isShortSelector(event.target, handleSelector);
							}
							else
							{
								triggerEvent = true;
							}

							//*!*Check for the route qualifier.
							if ((typeof event.data.routes[group][route].qualifier != 'undefined')
							&& (event.data.routes[group][route].handle))
							{
								//If the qualifier doesn't exist then set trigger to false.
								if (false)
								{
									triggerEvent = true;
								}
							}

							//If the event is on change then check the target is a select list.
							//*!*looks like i'm not getting a return from this event, the plugin may be firing beforehand?
							//i don't think this is working, the jquery reference is being kept on a removed eleement
							//This seems to be a known bug which needs to be investigate later. - known bug with jquery select list events
							if ((triggerEvent == true) && (event.data.type == 'change') && (event.target.nodeName == 'SELECT'))
							{
								if ((jQuery(event.target).data('value') == 'undefined')
								|| (jQuery(event.target).val() == jQuery(event.target).data('value')))
								{
									triggerEvent = false;
								}
								else
								{
									jQuery(event.target).data('value', jQuery(event.target).val());
								}
							}

							//If the handle is valid trigger dispatch.
							if (triggerEvent)
							{
								//If default behaviour has been suppressed prevent it.
								if ((typeof event.data.routes[group][route].behave != 'undefined')
								&& (event.data.routes[group][route].behave != true))
								{
									event.preventDefault();
								}

								//Call event dispatch function.
								if ((typeof event.data.routes[group][route].dispatch != 'undefined')
								&& (Twoshoes.isFunction(event.data.routes[group][route].dispatch)))
								{
									if (event.data.routes[group][route].subject)
									{
										subject = jQuery(event.data.routes[group][route].subject);
										event.data.routes[group][route].dispatch(event.target, subject);
									}
									else
									{
										event.data.routes[group][route].dispatch(event.target);
									}
								}
							}
						}
					})(route);
				}
			})(group);
		}
	},

	//this function should be a vnilla sql selct all from the tables, the value registry exists as a memory of values.
	//Not sure if this should be the case or the ther way around with the config being the memory of values and the
	//registry being the active component of the framework, the later is more consistant with current implementation
	//but config is being used actively in queries.
	//should do some error handling if table name is either not defined or not set.
	getRegisteredValues : function(tableName, tableRow)
	{
		//If the table row is not defined attempt to get the values.
		if (typeof tableRow != 'undefined')
		{
			if (typeof Twoshoes.valueRegistry[tableName]['values'][tableRow] != 'undefined')
			{
				return Twoshoes.valueRegistry[tableName]['values'][tableRow];
			}
			else
			{
				return false;
			}
		}
		//Otherwise get all values in the table.
		else if (tableName != 'undefined')
		{
			//If the table doesn't exist handle error.
			if (typeof Twoshoes.valueRegistry[tableName] == 'undefined')
			{
				Twoshoes.debug('(E)getRegisteredValues.tableName', 'tableName not registered', Twoshoes.debugError);
				return false;
			}
			else if (typeof Twoshoes.valueRegistry[tableName]['values'] == 'undefined')
			{
				Twoshoes.debug('(E)getRegisteredValues.tableName.values', 'values property not found', Twoshoes.debugError);
				return false;
			}
			else
			{
				return Twoshoes.valueRegistry[tableName]['values'];
			}
		}
		///Otherwise return all values.
		else
		{
			return Twoshoes.valueRegistry[tableName];
		}
	},

	//Re-initialises plugins for use on current interface state.
	// * Return:				VOID
	updatePlugins : function()
	{
		for (var label in Twoshoes.pluginRegistry)
		{
			(function(label)
			{
				//If the target element exists call the plugin.
				if (jQuery(Twoshoes.pluginRegistry[label].target).length > 0)
				{
 					if (Twoshoes.pluginRegistry[label].hasOwnProperty('callback'))
					{
						jQuery(Twoshoes.pluginRegistry[label].target)[Twoshoes.pluginRegistry[label].plugin](Twoshoes.pluginRegistry[label].config, Twoshoes.pluginRegistry[label].callback);
					}
					else
					{
						jQuery(Twoshoes.pluginRegistry[label].target)[Twoshoes.pluginRegistry[label].plugin](Twoshoes.pluginRegistry[label].config);
					}
				}
			})(label);
		}
	},

	//This needs to find the parents and this children.
	//*!*not sure how I am treating the children at this stage.
	updateBindings : function()
    {
        //loop through all the se widgets to find if the event has a binding.
        //use contents to get children elements
        //use parents to ge ancesors
        //no sure what to do with conflicts
    },

	//Validates the configuration group object before it is passed into the commander.
	// - group:					Name of the validation group to validate
	// - label:					Label of the subgroup to validate
	// - config:				Configuration object to validate
	// * Return:				True on validate success, otherwise false
	validateConfig : function(group, label, config)
	{
		return true;
	},

	//Adds value to the debugger and creates console if this is the first debug message.
	// - label:				Tite of the debugging entry for code location reference
	// - variable:			The values of he variable being debugged
	// - level:				Level of degbugging; debugRoute, debugRequest, debugTable, debugWidget, debugPlugin, debugBuild, debugQuery, debugError
	// * Return:			VOID
	// * NB: Still yet to apply options parameter and a break execution command w/ recovery escape
	//Not sure if these parameters should be passed as option set or not.
	debug : function(label, variable, level)
	{
		//Do nothing f debugging is turned off.
		if (!Twoshoes.debugging)
		{
			return;
		}

		Twoshoes.showConsole();

		//If no level is defined force debug.
		var doDebug = false;
		if (typeof level == 'undefined')
		{
			doDebug = true;
		}
		//Otherwise test debug level against console.
		else
		{
			doDebug = false;
			for (var i = 0, j = Twoshoes.console.length; i < j; i++)
			{
				if (!doDebug && (Twoshoes.console[i] & level) == level)
				{
					doDebug = true;
					break;
				}
			}
		}

		//Output debug result information.
		if (doDebug)
		{
			var values = '';
			//If the value is an array output values of the array.
			//*!*Need to do objects(key/vaalue) as well as nested arrays.
			if (Twoshoes.isArray(variable) || Twoshoes.isObject(variable))
			{
				values = '<table style="margin:0;border-style:dashed;">';
				for (var key in variable)
				{
					values = values+'<tr><td>['+key+']</td><td>=></td><td>'+variable[key]+'</td></tr>';
				}
				values = values+'</table>';
			}
			else
			{
				values = variable;
			}

			//Output the results.
			//*!*This output should be modular and plugged int the template system.
			var console = jQuery('#console > table#debug').append('<tr><td class="text-r">'+label+'</td><td class="text-c"> = </td><td class="text-l">'+values+'</td></tr>')
		}
	},

	//Creates the debugging output console.
	// - level:				Level of degbugging; debugRoute, debugRequest, debugTable, debugWidget, debugPlugin, debugBuild, debugQuery, debugError
	// * Return:			True if console was sucessfuly creaed, otherwise false.
	//*!*This stuff will eventually be moved into the templating system with a default output for templating to be turned off.
	showConsole : function(level)
	{
		//If the element has not been created do it.
		if (jQuery('#console').length == 0)
		{
			//*!*Will calculate height and width as a debugging paramter
			//*!*Possibly do this in a popup box(if so, hold box to framework for reference). Defer to templating system?
			jQuery('body').append('<div id="console"><table id="debug"></table><div id="utests"></div></div>');
			return true;
		}

		return false;
	},


///////////////////////////////////////////////////////////////////////////////
//             T A B L E    O P E R A T I O N   F U N C T I O N S            //
///////////////////////////////////////////////////////////////////////////////

//NB: On the table manipulation fuctions I need to check and update bound data
//I'll ned a directive to unbind data in the interface, it will have to be a reference to the table
//Still need to figure out a system to index and reference the bound data.

	//Sets the table name to execute a query on.
	// - table:			Name of the table to perform a query
	// * Return:		SELF
	table : function(table)
	{
		//Validate the table.
		if (!Twoshoes.isString(table))
		{
			Twoshoes.debug('(E)table.table', 'table not a string', Twoshoes.debugError);
			return this;
		}

		//Set table reference locally and debug.
		Twoshoes.query.table = table;
		Twoshoes.debug('(Q)table.table', table, Twoshoes.debugTable);

		return this;
	},

	//Gets the fields of the current table.
	// * Return:				Table fields definition list if it exist, otherwise
	fields : function()
	{
		if (typeof Twoshoes.config.tables == 'undefined')
		{
			//do error
			return false;
		}

		if (typeof Twoshoes.query.table == 'undefined' || Twoshoes.query.table == '')
		{
			//do error
			return false;
		}

		if (typeof Twoshoes.config.tables[Twoshoes.query.table] == 'undefined')
		{
			//do error
			return false;
		}

		if (typeof Twoshoes.config.tables[Twoshoes.query.table].fields == 'undefined')
		{
			//do error
			return false;
		}

		return Twoshoes.config.tables[Twoshoes.query.table].fields;
	},

	//Sets where conditions for the current query being built.
	// - conditions:		Array of where conditions for the table lookup
	// * return:			SELF
	where : function(conditions)
	{
		//Validate the conditions.
		if (!Twoshoes.isArray(conditions))
		{
			Twoshoes.debug('(E)where.conditions', 'conditions not an array', Twoshoes.debugError);
			return this;
		}

		//Set conditions reference locally and debug.
		Twoshoes.query.where = conditions;
		Twoshoes.debug('(Q)where.conditions', conditions, Twoshoes.debugQuery);
		return this;
	},

	//Order the query selection return by the field and direction.
	// - field:				Name of the field to order the return results by
	// - direction:			Direction of the results order, "desc" or "asc", defaults to "asc"
	// * Reutrn:			SELF
	order : function(field, direction)
	{
		//Validate the field.
		if (!Twoshoes.isString(field))
		{
			Twoshoes.debug('(E)order.field', 'field not a string', Twoshoes.debugError);
			return this;
		}

		//Validate the direction.
		if (typeof direction != 'undefined')
		{
			if (!Twoshoes.isString(direction))
			{
				Twoshoes.debug('(E)order.direction', 'direction not a string', Twoshoes.debugError);
				direction = 'asc';
			}
			else if (direction != 'desc')
			{
				if (direction != 'asc')
				{
					Twoshoes.debug('(E)order.direction', 'direction '+ direction +' not valid', Twoshoes.debugError);
					direction = 'asc';
				}
			}
		}
		else
		{
			direction = 'asc';
		}

		//Set order reference locally and debug.
		Twoshoes.query.order = [field, direction];
		Twoshoes.debug('(Q)order.field', field, Twoshoes.debugQuery);
		Twoshoes.debug('(Q)order.direction', direction, Twoshoes.debugQuery);

		return this;
	},

	//Limits the number of values retrieved in a table query.
	// - offset:			Number of results rows to start the query count
	// - range:				Numer of values to return in the result set
	// * Reutrn:			SELF
	// * NB: If the range is not defined then the offset is treated as the range
	limit : function(offset, range)
	{
		//Validate the offset.
		if (!Twoshoes.isNumber(offset))
		{
			Twoshoes.debug('(E)limit.offset', 'offset not an integer', Twoshoes.debugError);
			return this;
		}

		//Validate the range.
		if (range && !Twoshoes.isNumber(range))
		{
			Twoshoes.debug('(E)limit.range', 'range not an integer', Twoshoes.debugError);
			return this;
		}

		//If there is no range supply set the offset as range.
		if (!range)
		{
			//Set limit reference locally and debug.
			Twoshoes.query.range = offset;
			Twoshoes.query.offset = false;
			Twoshoes.debug('(Q)limit.range', offset, Twoshoes.debugQuery);
		}
		else
		{
			//Set limit reference locally and debug.
			Twoshoes.query.range = range;
			Twoshoes.query.offset = offset;
			Twoshoes.debug('(Q)limit.range', range, Twoshoes.debugQuery);
			Twoshoes.debug('(Q)limit.offset', offset, Twoshoes.debugQuery);
		}

		return this;
	},

	//Sets the query directive to return an associated array of field values and row positions.
	// - field:				The field to extract from the selct query results
	// - flip:				If true index results against the field value, otherwise(default) index against the row position
	// * Return:			Results as a key/value set with the field values indeed to the table row position
	//*!*NB: I want to push out the string value if one field is supplied
	extract : function(field, flip)
	{
		//Validate the field is a string.
		if (!Twoshoes.isString(field))
		{
			Twoshoes.debug('(E)extract.field', 'field not a string', Twoshoes.debugError);
			return this;
		}

		//Validate the flip directive is boolean.
		if (typeof flip != 'undefined' && !Twoshoes.isBoolean(flip))
		{
			Twoshoes.debug('(E)extract.flip', 'flip not a boolean', Twoshoes.debugError);
			return this;
		}
		else if (typeof flip == 'undefined')
		{
			flip = false;
		}

		//Set extract reference locally and debug.
		Twoshoes.query.extract = [field, flip];
		Twoshoes.debug('(Q)extract.field', field, Twoshoes.debugQuery);
		Twoshoes.debug('(Q)extract.flip', flip, Twoshoes.debugQuery);

		return this;
	},

	//Validates that the condition value supplied is in the correct format for use.
	// - condition:			Variable to be validated as a query lookup condition
	// * Return:			The lookup conditioif it is valid, otherwise false
	//*!*This updated routine needs testing
	isCondition : function(condition)
	{
		//*!*Needs to be checked
		//If the where directive is set to empty pass condiion.
		if ((!Twoshoes.isArray(condition)) && (condition.length == 0))
		{
			return true;
		}

		//If the lookup table is not throw validation error.
		if ((typeof Twoshoes.query.table == 'undefined') || (Twoshoes.query.table == ''))
		{
			Twoshoes.debug('(E)isCondition.query.table', 'Table is not set', Twoshoes.debugError);
			return false;
		}

		//If the conditions are not an array return false.
		if (!Twoshoes.isArray(condition))
		{
			Twoshoes.debug('(E)isCondition.condition', 'condition not an array', Twoshoes.debugError);
			return false;
		}
		else
		{
			//If the conditions are not a three count array return false.
			if (condition.length != 3)
			{
				Twoshoes.debug('(E)isCondition.condition.length', 'condition does not contain three values', Twoshoes.debugError);
				return false;
			}
			else
			{
				var validCondition = true;
				var statements = ['eq', 'lt', 'gt', 'neq', 'nlt', 'ngt', 'like'];
				for (var i = 0, j = condition.length; i < j; i++)
				{
					//If the conditions are not valid throw error.
					var passValidation = function()
					{
						(function()
						{
							//If the first two conditions are not a string set error.
							if (((i == 0) || (i = 1)) && (!Twoshoes.isString(condition[i])))
							{
								//*!*Check that the field exists in the table.
								Twoshoes.debug('(E)isCondition.condition['+i+']', 'condition['+i+']: '+condition[i]+' is not a valid type', Twoshoes.debugError);
								return false;
							}
							//Else if the second condition is not a valid statement set error.
							else if ((i == 1) && (!jQuery.inArray(condition[i], statements) == -1))
							{
								Twoshoes.debug('(E)isCondition.condition['+i+']', 'condition['+i+']: '+condition[i]+' is not a valid operator', Twoshoes.debugError);
								return false;
							}
							//Else if the third condition is not valid set error.
							else if ((i == 2) && ((!Twoshoes.isString(condition[i])) || (!Twoshoes.isNumber(condition[i])) || (!Twoshoes.isBoolean(condition[i]))))
							{
								Twoshoes.debug('(E)isCondition.condition['+i+']', 'condition['+i+']: '+condition[i]+' is not a valid type', Twoshoes.debugError);
								return false;
							}

							//If the field does not exist within the set table set error.
							if (i == 0)
							{
								var hasField = false;
								for (var n = 0, l = Twoshoes.query.table.fields.length; n < l; n++)
								{
									(function()
									{
										if (Twoshoes.config.table.fields[n] == condition[i])
										{
											hasField = true;
										}
									})(condition, i, n);
								}

								//If the field does not exist set error.
								if (hasField == false)
								{
									Twoshoes.debug('(E)isCondition.condition['+i+']', 'condition['+i+']: '+condition[i]+' is not a field within table: '+ Twoshoes.query.table, Twoshoes.debugError);
									return false;
								}
							}

						})(condition, i);
					}

					//Set condition as false if validation failed.
					if (!passValidation)
					{
						validCondition = false;
					}
				}

				return validCondition;
			}
		}
	},

	//*!*Need to be able interchange arrays with objects here so you can define query
	//structures as any combinaion of data structure
	//Tests where conditions against an indexed table row.
	// - indexedRow:		Key/value array of of a table row's field names and values
	// - conditions:		Query conditions to test on the indexed table row
	// * Return:			True if the row meets the query conditions, otherwse false
	isWhere : function(indexedRow, conditions)
	{
		var passConditions = true;

		//If there are no conditions
		if (typeof conditions == 'undefined')
		{
			return true;
		}

		//If the conditions are not an array return false
		if (!Twoshoes.isArray(conditions))
		{
			Twoshoes.debug('(E)isWhere.conditions', 'conditions not an array', Twoshoes.debugError);
			return false;
		}

		//If passed a valid condition format do lookup test.
		var validCondition = (function(){return Twoshoes.isCondition(conditions);})();
		if (validCondition)
		{
			switch (conditions[1].toLowerCase())
			{
				case 'eq':
					if (indexedRow[conditions[0]] != conditions[2])
					{
						passConditions = false;
					}
					break;
				case 'lt':
					if (indexedRow[conditions[0]] >= conditions[2])
					{
						passConditions = false;
					}
					break;
				case 'gt':
					if (indexedRow[conditions[0]] <= conditions[2])
					{
						passConditions = false;
					}
					break;
				case 'neq':
					if (indexedRow[conditions[0]] == conditions[2])
					{
						passConditions = false;
					}
					break;
				case 'nlt':
					if (indexedRow[conditions[0]] < conditions[2])
					{
						passConditions = false;
					}
					break;
				case 'ngt':
					if (indexedRow[conditions[0]] > conditions[2])
					{
						passConditions = false;
					}
					break;
				case 'like':
					//Should probably test if row[conditions[0]] is string or not. - or use toString()
					if (indexedRow[conditions[0]].indexOf(conditions[2]) == -1)
					{
						passConditions = false;
					}
					break;
				default:
					Twoshoes.debug('(Q)isWhere.conditions.evaluator', 'evaluator not valid', Twoshoes.debugQuery);
			}
		}
		//Otherwise recursively loop through and test conditions.
		else
		{
			for (var key in conditions)
			{
				//Test or condition nesting.
				if (Twoshoes.isString(key) && key.toLowerCase() == 'or')
				{
					passConditions = false;
					for (var i = 0, j = conditions[key].length; i < j; i++)
					{
						var passedCondition = (function(){return Twoshoes.isWhere(indexedRow, conditions[key][i]);})(i);
						if (passedCondition)
						{
							passConditions = true;
						}
					}
				}
				//Test and condition nesting.
				else if (Twoshoes.isString(key) && key.toLowerCase() == 'and')
				{
					for (var i = 0, j = conditions[key].length; i < j; i++)
					{
						var passedCondition = (function(){return Twoshoes.isWhere(indexedRow, conditions[key][i]);})(i);
						if (!passedCondition)
						{
							passConditions = false;
						}
					}
				}
				//Groups of arrays are treated as and nesting.
				else
				{
					var passedCondition = (function(){return Twoshoes.isWhere(indexedRow, conditions[key]);})();
					if (!passedCondition)
					{
						passConditions = false;
					}
				}
			}
		}

		return passConditions;
	},
	
	//This function uses the jquery serialize() to get the form values as a string
	//then it takes this string and converts the values into an object
	//this should be a helper object
	getFormValues : function(form)
	{
		var data = {};
		var values = jQuery(form).serialize();
		//split the values and construct the object.

		return data;
	},

	//Americanis(z)ation wrapper of serialise.
	unserialize : function(data)
	{
		return Twoshoes.unserialise(data);
	},

	//Americanis(z)ation wrapper of serialise.
	serialize : function(data)
	{
		return Twoshoes.serialise(data);
	},

	//Builds an object from a serialised stack at the passed position
	// - buildValues:			Split values of stack to build an object with
	// - buildTokens:			Split tokens of stack to build an object with
	// - position:				Position in the stack from which to build the object
	// * Return:				The object which is built from the supplied stack
	// * NB: No major graceful recoveries in the function yet.
	buildObject : function(buildValues, buildTokens, position)
	{
		var isBuilt = false;
		var builtObject = {};
		var propertyKey = '';
		var propertyPosition = 0;
		while (position < buildTokens.length)
		{
			if (isBuilt)
			{
				break;
			}

			//the object must be returned here, need to et it and break the loop.
			(function()
			{
				switch (buildTokens[position])
				{
					case Twoshoes.objectTokens.open:
						if (propertyKey != '')
						{
							(function()
							{
								//Get the nested build object.
								builtObject[propertyKey] = Twoshoes.buildObject(buildValues, buildTokens, position + 1);

								//Set the position of the current object close.
								var openObjects = 1;
								for (var i = position + 1, j = buildTokens.length; i < j; i++)
								{
									(function()
         							{
										if (openObjects > 0)
										{
											if (buildTokens[position] == Twoshoes.objectTokens.open)
											{
												openObjects++;
											}
											else if (buildTokens[position] == Twoshoes.objectTokens.close)
											{
												openObjects--;
											}

									        position++;
										}
							        })(i, position);
								}
							})(position);
						}
						else
						{
							return false;
						}
						break;

					case Twoshoes.objectTokens.close:
						if (propertyKey == '')
						{
							isBuilt = true;
						}
						else
						{
							return false;
						}
						break;

					case Twoshoes.objectTokens.position:
						if (propertyKey != '')
						{
							builtObject[propertyKey] = null;
							propertyKey = '';
						}
						break;

					case Twoshoes.objectTokens.property:
						if (propertyKey != '')
						{
							//need to check the position key is not taken.
							builtObject[propertyKey] = propertyPosition;
						}
						break;

					case Twoshoes.objectTokens.value:
						if (propertyKey != '')
						{
							//parse the value type here. - not needed?
							builtObject[propertyKey] = buildValues[position];
							propertyKey = '';
						}
						else
						{
							propertyKey = buildValues[position];
						}
						break;

					default: return false;
				}
			})(position);

			position++;
		}

// console.log('error: '+builtObject);
// console.log('key: '+propertyKey);
// console.log(propertyPosition);
		return builtObject;
	},

	//Converts a serialised object/dataset into an object.
	// - data:				String representing a serialised data set
	// * Return:			Object with properties corresponding to serialised values
	unserialise : function(data)
	{
//test case: {key1:"my:value01;";key2:{0:value3}}
// console.log(variable);
		//Get the stack split regex.
		var objectSplitTags = '';
		for (var key in Twoshoes.objectTags)
		{
			(function()
			{
				objectSplitTags += Twoshoes.objectTags[key]+'|'; //wots this pipe doing?
			})(key);
		}

		objectSplitTags = objectSplitTags.substr(0, objectSplitTags.length - 1);
		var regStackSplit = new RegExp('('+objectSplitTags+')');

		//Split the stack.
		var splitValues = data.split(regStackSplit);

		//Build the token stack.
		var splitTokens = [];
		var splitLength = 0;
		var splits = Twoshoes.count(splitValues);
		for (var i = 0, j = splitValues.length; i < j; i++)
		{
			(function()
			{
				switch (splitValues[i])
				{
					case '{': splitTokens[splitLength] = Twoshoes.objectTokens.open; break;
					case '}': splitTokens[splitLength] = Twoshoes.objectTokens.close; break;
					case ';': splitTokens[splitLength] = Twoshoes.objectTokens.position; break;
					case ':': splitTokens[splitLength] = Twoshoes.objectTokens.property; break;
					case '"': splitTokens[splitLength] = Twoshoes.objectTokens.string; break;
					default: splitTokens[splitLength] = Twoshoes.objectTokens.value; break;
				}

				splitLength++;
			})(i);
		}

		//Remove all empty positions from the stack.
		for (var i = 0, j = splitValues.length; i < j; i++)
		{
			(function()
			{
				if (splitValues[i] == '')
				{
					splitTokens.splice(i, 1);
					splitValues.splice(i, 1);
				}
			})(i);
		}

		//Resolve all string values back into the stack.
		//*!*Need to check for a backslash, does this get added to the query serialize call?
		var tokenIsString = false;
		for (var i = 0, j = splitTokens.length; i < j; i++)
		{
			(function()
			{
				if (tokenIsString == true)
				{
					if (splitTokens[i] == Twoshoes.objectTokens.string)
					{
						tokenIsString = false;
					}
					else
					{
						splitTokens[i] = Twoshoes.objectTokens.string;
					}
				}
				else
				{
					if (splitTokens[i] == Twoshoes.objectTokens.string)
					{
						tokenIsString = true;
					}
				}
			})(i);
		}

		//Combine all string partials into a value token.
		var combineString = true;
		while (combineString)
		{
			var stringPosition = jQuery.inArray(Twoshoes.objectTokens.string, splitTokens);
			if (stringPosition != -1)
			{
				//get the next string position and splice the two values together.
				var secondPostion = jQuery.inArray(Twoshoes.objectTokens.string, splitTokens, stringPosition + 1);
				if (secondPostion == -1)
				{
					combineString = false;
				}
				else
				{
					//If there are two string tokens next to each other combine them into a single value.
					if (secondPostion == stringPosition + 1)
					{
						var combineValues = splitValues[stringPosition] + splitValues[secondPostion];
						splitTokens.splice(stringPosition, 1);
						splitValues.splice(stringPosition, 2, combineValues);
					}
				}
			}
			else
			{
				combineString = false;
			}
		}

		//Go through the stack and replace string tokens with value tokens.
		for (var i = 0, j = splitTokens.length; i < j; i++)
		{
			(function()
			{
				if (splitTokens[i] == Twoshoes.objectTokens.string)
				{
					splitValues[i] = splitValues[i].substr(1, splitValues[i].length - 2);
					splitTokens[i] = Twoshoes.objectTokens.value;
				}
			})(i);
		}
// console.log(splitTokens);
// console.log(splitValues);

		//Get the stack as an object
		//*!*this stack has not been ready for the graceful degradation from the backslash, needs research.
		if (splitTokens[0] == Twoshoes.objectTokens.open)
		{
			var stackObject = Twoshoes.buildObject(splitValues, splitTokens, 1);
			return stackObject;
		}
		else
		{
			Twoshoes.debug('(E)unserialise.variable', data+ 'is not an object string', Twoshoes.debugError);
		}

		return false;
	},

	//Serialises and object property set into a string for data handling
	// - data:				Object or array of values to be converted into a string
	// * Return:			String of values from an object or array
	serialise : function(data)
	{
		var result = '';

		if (!Twoshoes.isArray(data) && !Twoshoes.isObject(data))
		{
			return false;
		}

		//Construct serialisation string.
		for (var key in data)
		{
			(function()
			{
				//Convert all values to string, maybe do test for int, float, etc later.
				var dataValue = '"'+ data[key].replace('"', '\"') +'"';
				result = result +':'+ key +';'+ dataValue;
			})(key);
		}

		result = '{'+ result.substr(1, result.length) +'}';
		return result;
	},

	//*!*Need to write an indexing function to make key/value pairs out of more then one row

	//Indexes the table row against the field labels.
	// - row:					Table row to index prior to condition testing
	// - fields:				Name of the correspoding fields for the table row
	// * Return:				The combined key/value object property set for the table row
	indexRow : function(row, fields)
	{
		if (Twoshoes.isString(fields))
		{
			//check table exists
			fields = Twoshoes.config.tables[fields].fields;
		}
		else if (!Twoshoes.isArray(fields))
		{
			//do error.
			return false;
		}

		//Index the table row.
		indexedRow = {};
		if (typeof row != 'undefined')
		{
			for (var i = 0, j = fields.length; i < j; i++)
			{
				(function(i)
				{
					indexedRow[fields[i]] = row[i];
				})(i);
			}
		}

		return indexedRow;
	},

	//Counts the number of actions which have been made on the data.
	// - table:					If the table is specified only get the action
	// * Return:				Number of actions which have been made on the named table
	countActions : function(table)
	{
		var actions = 0;

		//Look for all actions.
		if (typeof table == 'undefined')
		{
			for (var model in Twoshoes.config.tables)
			{
				(function()
    			{
					//Get number of actions for each data row.
					if (typeof Twoshoes.config.tables[model].actions != 'undefined')
					for (var i = 0, j = Twoshoes.count(Twoshoes.config.tables[model].actions); i < j; i++)
				    {
						(function()
      					{
							actions = actions + Twoshoes.countTableRowActions(model, i);
						})(model, i);
				    }
			    })(model);
			}
		}
		else
		{
			//test the table exists
			if (typeof Twoshoes.config.tables[table] != 'undefined')
			{
				for (var i = 0, j = Twoshoes.config.tables[table].actions.length; i < j; i++)
			    {
					(function()
		      		{
						for (var n = 0, m = Twoshoes.config.tables[table].actions[i].length; i < j; i++)
						{
							actions = actions + Twoshoes.countTableRowActions(table, i);
						}
					})(i);
			    }
			}
			else
			{
				Twoshoes.debug('(Q)countActions.table', table+' table does not exist', Twoshoes.debugError);
			}
		}

		return actions;
	},

	//Get number of actions my type on the table row entry.
	// - table:				Name for thatable to look up row actions
	// - row:				Row index number to look for actions
	// - action:			Type of action to loook for. If not defined count all actions
	// * Return:			Number of actions that has occured on the named table
	countTableRowActions : function(table, row, action)
	{
		var actions = 0;
		var actionRowCount = Twoshoes.count(Twoshoes.config.tables[table].actions[row]);
		if ((actionRowCount != false) && (actionRowCount > 0))
		{
			for (var actionRow in Twoshoes.config.tables[table].actions[row])
			{
				(function()
				{
					//If the action does not have a type then don't count it.
					if ((typeof Twoshoes.config.tables[table].actions[row][actionRow] != 'undefined')
					&& (Twoshoes.config.tables[table].actions[row][actionRow] != null))
					{
						if ((typeof Twoshoes.config.tables[table].actions[row][actionRow]['type'] != 'undefined')
						&& (Twoshoes.config.tables[table].actions[row][actionRow]['type'] != null))
						{
							//If the action is not defined then just count the number of actions against that table row.
							if (typeof action == 'undefined')
							{
								actions++;
							}
							//Otherwise get action type for table row entry.
							else if (Twoshoes.config.tables[table].actions[row][actionRow]['type'] == action)
							{
								actions++;
							}
						}
					}
				})(actions);
			}
		}

		return actions;
	},

	//Gets the table row actions as an array.
	// - table:				Name for the table to look up row actions
	// - row:				Row index number to look for actions
	// * Return:			Number of actions which exist for that atble row
	//*!*This function will go into the unittestng area.
	getTableRowActions : function(table, row)
	{
		var actions = [];
		var actionCount = 0;
		var actionRowCount = Twoshoes.count(Twoshoes.config.tables[table].actions[row]);

		if ((actionRowCount != false) && (actionRowCount > 0))
		{
			for (var actionRow in Twoshoes.config.tables[table].actions[row])
			{
				(function(actionCount)
				{
					if (Twoshoes.config.tables[table].actions[row][actionRow]['type'] != 'undefined')
					{
						actions[actionCount] = Twoshoes.config.tables[table].actions[row][actionRow];
						actionCount++;
					}
				})(actionCount);
			}
		}

		return actions;
	},

	//Set an action to the table to match a data transaction which changes a table value.
	// - table:					Name of the table to create action for
	// - row:					Row of the data to set the action to
	// - action:				Type of action to set for the data
	// - values:				Values to set for the action
	// * Return:				True if the data has been updated successfully, otherwise false
	setTableRowAction : function(table, row, action, values)
	{
		//If the action is not valid handle exception
		if (jQuery.inArray(action, Twoshoes.tableActions) == -1)
		{
			alert('This action is not valid, need error/debug?');
		}

		if (typeof Twoshoes.config.tables[table].actions == 'undefined')
		{
			Twoshoes.config.tables[table].actions = [];
		}

		//Get size of the current action list.
		var actionRows = 0;
		if (typeof Twoshoes.config.tables[table].actions[row] == 'undefined')
		{
			Twoshoes.config.tables[table].actions[row] = [];
		}
		
		actionRows = Twoshoes.countTableRowActions(table, row);

		//If the values are not an object format them into an array.
		var valuesArray = {};
		if (!Twoshoes.isObject(values))
		{
			if (!Twoshoes.isArray(values))
			{
				//handle error.
				return false;
			}
			//Set values as an array of values.
			for (var key in values)
			{
				(function(key, values)
				{
					valuesArray[key] = values[key];
				})(key, values);
			}
		}
		else
		{
			valuesArray = values;
		}

		if (typeof Twoshoes.config.tables[table].actions[row] == 'undefined')
		{
			Twoshoes.config.tables[table].actions[row] = [];
		}

		if ((action == 'insert') && (actionRows > 0))
		{
			//do error here.
			alert('error');
			return false;
		}
		else
		{
			Twoshoes.config.tables[table].actions[row][actionRows] = {};
			Twoshoes.config.tables[table].actions[row][actionRows]['type'] = action;
			Twoshoes.config.tables[table].actions[row][actionRows]['values'] = valuesArray;
		}

		return true;
	},

	//Orders a two dimensional array rows by index column.
	// - table:				Two dimensional array to order
	// - column:			Index of x-axis to order rows by
	// - direction:			Direction of row ordering, "asc" or "desc"
	// * Return:			Reordered table by column values
	orderTable : function(table, column, direction)
	{
		var orderedTable = new Array();
		var tableLength = table.length;
		var orderedLength = 0;

		while (tableLength > 0)
		{
			//Find the next ordered item.
			var pushIndex = 0;
			var pushValue = false;
			for (var i = 0, j = table.length; i < j; i++)
			{
				(function()
				{
					if ((pushValue == false)
					|| (direction == 'asc' && table[i][column] < pushValue)
					|| (direction == 'desc' && table[i][column] > pushValue))
					{
						pushIndex = i;
						pushValue = table[i][column];
					}
				})(i);
			}

			//Add row to ordered results.
			orderedTable[orderedLength] = table[pushIndex];
			table.splice(pushIndex, 1);
			tableLength--;
			orderedLength++;
		}

		return orderedTable;
	},

	//Limits a two dimensional table to a specified range and offset.
	// - table:				Two dimensional array to reduce in row size
	// - range:				Number of rows to return from the table
	// - offset:			Starting position of return results set
	// * Return:			Reduced table of results matching limiting values
	limitTable : function(table, range, offset)
	{
		limitedTable = [];
		limitValue = 0;

		//Get the range and offset.
		if (typeof range == 'undefined')
		{
			range = false;
		}

		if (typeof offset == 'undefined')
		{
			offset = false;
		}

		//Extract reduced rows from table.
		for (var i = 0, j = table.length; i < j; i++)
		{
			(function()
			{
				if ((!offset || (i >= offset))
				&& (!range || limitValue < range))
				{
					limitedTable[limitValue] = table[i];
					limitValue++;
				}
			})(i);
		}

		return limitedTable;
	},

	//Performs the table select lookup.
	// - memory:			Remembers the query after returning the data
	// * Return:			Array of table rows which meets the select criteria, false on failure
	// * NB: Number of affected rows is set locally
	select : function(memory)
	{
		var results = [];
		var affectedRows = [];

		Twoshoes.debug('(Q)select.memory', memory, Twoshoes.debugQuery);

		//If there is no table defined return false.
		if (!Twoshoes.query.table)
		{
			Twoshoes.debug('(E)select.query.table', 'Table is not set', Twoshoes.debugError);
			return false;
		}

		//Get the table to query.
		var hasTable = false;
		for (var table in Twoshoes.config.tables)
		{
			(function()
			{
				if (table == Twoshoes.query.table)
				{
					hasTable = true;
				}
			})(table);
		}

		if (!hasTable)
		{
			Twoshoes.debug('(E)select.hasTable', 'Table '+Twoshoes.query.table+' is not found', Twoshoes.debugError);
			return results;
		}

		//Do table lookup.
		var resultsRow = 0;
		for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].values.length; i < j; i++)
		{
			(function()
   			{
				var row = Twoshoes.config.tables[Twoshoes.query.table].values[i];
				Twoshoes.debug('(Q)select.row', row, Twoshoes.debugQuery);

				//Index the table row.
				var indexedRow = (function(){return Twoshoes.indexRow(row, Twoshoes.config.tables[Twoshoes.query.table].fields);})();

				//*!*Ensure the number of fields matched the number of columns in the row.
				//Not sure yet what the contigency is.
				if (Twoshoes.config.tables[Twoshoes.query.table].fields.length != row.length)
				{
					Twoshoes.debug('(Q)select.row', 'Fields length on table '+Twoshoes.query.table+' does not equal row length', Twoshoes.debugError);
				}

				//Test each condition.
				var passConditions = (function(){return Twoshoes.isWhere(indexedRow, Twoshoes.query.where);})();
				if (passConditions)
				{
					results[resultsRow] = row;
					affectedRows[resultsRow] = i;
					resultsRow++;
				}
			})(i);
		}

		//Order results.
		if ((Twoshoes.isArray(Twoshoes.query.order)) && (Twoshoes.count(Twoshoes.query.order) > 0))
		{
			//Validate the field exists.
			var tableOrderColumn = false;
			for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].fields.length; i < j; i++)
			{
				if (tableOrderColumn == false)
				{
					(function()
					{
						if (Twoshoes.config.tables[Twoshoes.query.table].fields[i] == Twoshoes.query.order[0])
						{
							tableOrderColumn = i;
						}
					})(i);
				}
			}

			if (tableOrderColumn === false)
			{
				Twoshoes.debug('(E)select.tableHasOrderField', 'Table cannot be ordered by '+Twoshoes.query.order[0], Twoshoes.debugError);
			}
			else
			{
				results = Twoshoes.orderTable(results, tableOrderColumn, Twoshoes.query.order[1]);
			}
		}

		//Limit the results.
		if (Twoshoes.query.range)
		{
			results = Twoshoes.limitTable(results, Twoshoes.query.range, Twoshoes.query.offset)
		}

		//Extract column values.
		if (Twoshoes.query.extract && Twoshoes.query.extract.length > 0)
		{
			if (!Twoshoes.isArray(Twoshoes.query.extract))
			{
				Twoshoes.debug('(E)select.query.extract', 'Extract is not an array', Twoshoes.debugError);
			}
			else
			{
				//Get the column number to extract.
				var extractColumn = 0;
				for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].fields.length; i < j; i++)
				{
					(function()
					{
						if (Twoshoes.config.tables[Twoshoes.query.table].fields[i] == Twoshoes.query.extract[0])
						{
							extractColumn = i;
						}
					})(i);
				}

				//Extract the column from results.
				var extractedResults = new Array();
				for (var i = 0, j = results.length; i < j; i++)
				{
					(function()
					{
						//If the value is a valid property name add it to the results.
						if ((typeof Twoshoes.query.extract[1] != 'undefined') && (Twoshoes.query.extract[1]))
						{
							var key = results[i][extractColumn].toString();
							if (extractedResults[key] == 'undefined')
							{
								extractedResults[key] = i;
							}
							else
							{
								Twoshoes.debug('(E)select.query.extract', 'Extracted value '+key+' at row '+i+' is not a unique value', Twoshoes.debugError);
							}
						}
						else
						{
							extractedResults[i] = results[i][extractColumn];
						}
					})(i);
				}

				results = extractedResults;
			}
		}

		//Reset the query object.
		if (typeof memory == 'undefined' || !memory)
		{
			Twoshoes.query = {};
			Twoshoes.affected = [];
		}

		Twoshoes.affected = affectedRows;
		return results;
	},

	//Updates a table data on rows tha meet the where conditions.
	// - values:			Array of data values to update the table rows with
	// - fields:			Array of data field labels corresponding to the data
	// - memory:			Remembers the query after updating the data
	// * Return:			Number of rows affected, false n failure
	// * NB: If fields are not supplied then the values are applied in column order
	// or, if it is an object get their keys from the propety names.
	// * NB: If fields are boolean this value is treated as the memory parameter
	// * NB: Number of affected rows is set locally, not sure this is working correctly
	update : function(values, fields, memory)
	{
		var affectedRows = [];

		Twoshoes.debug('(Q)update.values', values, Twoshoes.debugQuery);
		Twoshoes.debug('(Q)update.fields', fields, Twoshoes.debugQuery);
		Twoshoes.debug('(Q)update.memory', memory, Twoshoes.debugQuery);

		//If there is no table defined return false.
		if (!Twoshoes.query.table)
		{
			Twoshoes.debug('(E)update.query.table', 'Table is not set', Twoshoes.debugError);
			return false;
		}

		//Get the table to query.
		var hasTable = false;
		for (var table in Twoshoes.config.tables)
		{
			if (table == Twoshoes.query.table)
			{
				hasTable = true;
			}
		}

		if (!hasTable)
		{
			Twoshoes.debug('(E)update.hasTable', 'Table '+Twoshoes.query.table+' is not found', Twoshoes.debugError);
			return false;
		}

		//need to check for field here.

		//Do table update.
		var resultsRow = 0;
		var resultsCount = 0;
		for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].values.length; i < j; i++)
		{
			(function()
			{
				var row = Twoshoes.config.tables[Twoshoes.query.table].values[i];
				Twoshoes.debug('(Q)update.row', row, Twoshoes.debugQuery);

				//Index the table row.
				var indexedRow = (function(){return Twoshoes.indexRow(row, Twoshoes.config.tables[Twoshoes.query.table].fields);})();

				//*!*Ensure the number of fields matched the number of columns in the row.
				//Not sure yet what the cotigency is
				if (Twoshoes.config.tables[Twoshoes.query.table].fields.length != row.length)
				{
					Twoshoes.debug('(Q)update.row', 'Fields length does not equal row length', Twoshoes.debugError);
				}

				//Test each condition.
				var passConditions = (function(){return Twoshoes.isWhere(indexedRow, Twoshoes.query.where);})();
				if (passConditions)
				{
					//Get query limits.
					var withinLimits = true;
					var limitOffset = (Twoshoes.query.offset)? Twoshoes.query.offset: 0;

					if (Twoshoes.query.offset && Twoshoes.query.offset > resultsRow)
					{
						withinLimits = false;
					}

					if (withinLimits && Twoshoes.query.range && (limitOffset + Twoshoes.query.range <= resultsRow))
					{
						withinLimits = false;
					}

					//Update the row data.
					//*!*I have not dealt with the fields parameter not being passed to this function
					//it might have to be a fork in this logic to just update from first column through to the end of the values array
					if (withinLimits)
					{
						//*!*Inside this loop is basically the same as is found in the insert, best to refactor into a function at one point.
						var column = 0;
						actionData = [];
						for (var label in indexedRow)
						{
							//Set each value to the table field.
							for (var n = 0, l = fields.length; n < l; n++)
							{
								(function()
								{
									if (fields[n] == label)
									{
										Twoshoes.config.tables[Twoshoes.query.table].values[i][column] = values[n];
										actionData[fields[n]] = values[n];
									}
								})(i, n, column);
							}

							column++;
						}

						//Set the update action to the values table.
						if (Twoshoes.count(actionData) > 0)
						{
							(function()
							{
								if (Twoshoes.setTableRowAction(Twoshoes.query.table, i, 'update', actionData) == false)
								{
									//Debug if set row action fails.
									Twoshoes.debug('(Q)update.setTableRowAction error', false, Twoshoes.debugQuery);
								}
							})(i, actionData);
						}

						affectedRows[resultsCount] = i;
						resultsCount++;
					}

					resultsRow++;
				}
			})(i, resultsRow, resultsCount);
		}

		//Reset the query object.
		//*!*Is this working as it should?
		if (!Twoshoes.isArray(fields) && (typeof fields == 'undefined' || !fields))
		{
			Twoshoes.query = {};
			Twoshoes.affected = [];
		}
		else if (typeof memory == 'undefined' || !memory)
		{
			Twoshoes.query = {};
			Twoshoes.affected = [];
		}

		Twoshoes.affected = affectedRows;
		return resultsCount;
	},

	//Inserts data into the query table as an appended row.
	// - values:			Row array of table data to insert into table
	// - fields:			Array of data field labels corresponding to the data
	// - memory:			Remembers the query inserting returning the data
	// * Return:			Data inserted into the table including defaults
	// * NB: Number of affected rows is set locally
	//*!*I should make an import function which will insert multiple rows into the table
	//*!*Remember to update the debugging calls.
	//*!*Going to update the way this function works to optionally replace the values and fields parameters with and object to make it easier to use.
	insert : function(values, fields, memory)
	{
		var affectedRows = [];

		Twoshoes.debug('(Q)insert.values', values, Twoshoes.debugQuery);
		Twoshoes.debug('(Q)insert.fields', fields, Twoshoes.debugQuery);
		Twoshoes.debug('(Q)insert.memory', memory, Twoshoes.debugQuery);

		//If there is no table defined return false.
		if (!Twoshoes.query.table)
		{
			Twoshoes.debug('(E)insert.query.table', 'Table is not set', Twoshoes.debugError);
			return false;
		}

		//Get the table to query.
		var hasTable = false;
		for (var table in Twoshoes.config.tables)
		{
			(function()
			{
				if (table == Twoshoes.query.table)
				{
					hasTable = true;
				}
			})(table);
		}

		if (!hasTable)
		{
			Twoshoes.debug('(E)insert.hasTable', 'Table '+Twoshoes.query.table+' is not found', Twoshoes.debugError);
			return false;
		}

		//Format row data for insertion.
		var data = [];
		for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].fields.length; i < j; i++)
		{
			(function()
			{
				var passedField = false;
				if (Twoshoes.isArray(fields))
				{
					for (var n = 0, l = fields.length; n < l; n++)
					{
						(function()
						{
							if (Twoshoes.config.tables[Twoshoes.query.table].fields[i] == fields[n])
							{
								passedField = n;
							}
						})(i, n);
					}
				}
				else
				{
					if (!Twoshoes.isBoolean(fields))
					{
						Twoshoes.debug('(E)insert.fields', 'Fields are not an array or boolean', Twoshoes.debugError);
					}

					//If the value is supplied set it otherwise get the default
					//*!*This needs to equal someting for comparisson. - this needs to be looked into.
					//if the user fucks this up then they need to be informed that the data supplie is invalid
					if (values[i])
					{
						passedField = i;
					}
					else
					{
						passedField = false;
					}
				}

				//If the field has been supplied get the passed value.
				if (passedField !== false)
				{
					data[i] = values[passedField];
				}
				//Otherwise get the default table cell value.
				else
				{
					if (Twoshoes.config.tables[Twoshoes.query.table].defaults == 'undefined')
					{
						Twoshoes.debug('(E)insert.query.table', 'Table '+Twoshoes.query.table+' does not have defaults set', Twoshoes.debugError);
						return false;
					}
					else
					{
						if (Twoshoes.config.tables[Twoshoes.query.table].defaults[i] != 'undefined')
						{
							//*1* This might be overriding my routines.
							data[i] = Twoshoes.config.tables[Twoshoes.query.table].defaults[i];
						}
						else
						{
							data[i] = null;
						}
					}

					Twoshoes.debug('(Q)insert.default '+Twoshoes.config.tables[Twoshoes.query.table]['fields'][i], data[i], Twoshoes.debugQuery);
				}
			})(i);
		}

		//Set the row data to the table.
		var rows = Twoshoes.config.tables[Twoshoes.query.table].values.length;
		Twoshoes.config.tables[Twoshoes.query.table].values[rows] = data;
		affectedRows[0] = rows;

		//Format the action data.
		actionData = [];
		for (var i = 0, j = values.length; i < j; i++)
		{
			(function()
			{
				actionData[fields[i]] = values[i];
			})(i);
		}

		//Set the insert action to the values table.
		if (Twoshoes.setTableRowAction(Twoshoes.query.table, rows, 'insert', actionData) == false)
		{
			//Debug if set row action fails.
			Twoshoes.debug('(Q)insert.setTableRowAction error', false, Twoshoes.debugQuery);
		}

		//Reset the query object.
		if (typeof memory == 'undefined' || !memory)
		{
			Twoshoes.query = {};
			Twoshoes.affected = [];
		}

		Twoshoes.affected[0] = affectedRows;
		return true;
	},

	//Removes table rows that meet the conditions.
	// - memory:			Remembers the query after updating the data
	// * Return:			Number of affected rows that have been deleted, false on failure
	// * NB: Number of affected rows is set locally
	//*!*Change the return value to the row numbers which have been inserted s that we can use them for the linking functionality
	//*!*appartently delete is a reserved word, need to look into this
	// NB Affected rows are spliced so they are not useful for the table but good for looking up references to the data which was removed.
	remove : function(memory)
	{
		var affectedRows = [];

		Twoshoes.debug('(Q)remove.memory', memory, Twoshoes.debugQuery);

		//If there is no table defined return false.
		if (!Twoshoes.query.table)
		{
			Twoshoes.debug('(E)remove.query.table', 'Table is not set', Twoshoes.debugError);
			return false;
		}

		//Get the table to query.
		var hasTable = false;
		for (var table in Twoshoes.config.tables)
		{
			(function()
			{
				if (table == Twoshoes.query.table)
				{
					hasTable = true;
				}
			})(table);
		}

		if (!hasTable)
		{
			Twoshoes.debug('(E)remove.hasTable', 'Table '+Twoshoes.query.table+' is not found', Twoshoes.debugError);
			return false;
		}

		//Do table lookup.
		var deleteRows = [];
		var resultsRow = 0;
		var resultsCount = 0;
		for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].values.length; i < j; i++)
		{
			(function()
			{
				var row = Twoshoes.config.tables[Twoshoes.query.table].values[i];
				Twoshoes.debug('(Q)remove.row', row, Twoshoes.debugQuery);

				//Index the table row.
				var indexedRow = (function(){return Twoshoes.indexRow(row, Twoshoes.config.tables[Twoshoes.query.table].fields);})();

				//*!*Ensure the number of fields matched the number of columns in the row.
				//Not sure yet what the cotigency is
				if (Twoshoes.config.tables[Twoshoes.query.table].fields.length != row.length)
				{
					Twoshoes.debug('(Q)remove.row', 'Fields length does not equal row length', Twoshoes.debugError);
				}

				//Test each condition.
				var passConditions = (function(){return Twoshoes.isWhere(indexedRow, Twoshoes.query.where);})();
				if (passConditions)
				{
					//Get query limits.
					var withinLimits = true;
					var limitOffset = (Twoshoes.query.offset)? Twoshoes.query.offset: 0;

					if (Twoshoes.query.offset && Twoshoes.query.offset > resultsRow)
					{
						withinLimits = false;
					}

					if (withinLimits && Twoshoes.query.range && (limitOffset + Twoshoes.query.range <= resultsRow))
					{
						withinLimits = false;
					}

					//Update the row data.
					//*!*I have not dealt with the fields parameter not being passed to this function
					//it might have to be a fork in this logic to just update from first column through to the end of the values array
					if (withinLimits)
					{
						deleteRows[resultsCount] = i;
						affectedRows[resultsCount] = i;
						resultsCount++;
					}

					resultsRow++;
				}

			})(i, deleteRows, resultsRow, resultsCount);
		}

		//Slice the affected rows from the table.
		for (var i = 0, j = resultsCount; i < j; i++)
		{
			(function()
			{
				Twoshoes.config.tables[Twoshoes.query.table].values.splice(deleteRows[i] - i, 1);
			})(i);
		}

		//Reset the query object.
		if (typeof memory == 'undefined' || !memory)
		{
			Twoshoes.query = {};
			Twoshoes.affected = [];
		}

		Twoshoes.affected = affectedRows;
		return affectedRows;
	},

	//Sets a link to the query results.
	// - linkTable:			Name of the table to link the data results to
	// - linkRow:			Integer or array of integer rows of the table that is bing linked to
	// - memory:			Remembers the query after linking the data
	// * Return:			The results rows which have been links
	// * NB: Number of affected rows is set locally
	// * NB: If linkRow is true then the Twohoes.affected is used
	link : function(linkTable, linkRow, memory)
	{
		Twoshoes.debug('(Q)link.memory', memory, Twoshoes.debugQuery);

		var results = [];
		var affectedRows = [];

		//If the link row is true get the affected reference.
		var rowsToLink = [];
		if (Framework.isBoolean(linkRow))
		{
			rowsToLink = Framework.affected;
		}
		else if (Framework.isInteger(linkRow))
		{
			rowsToLink[0] = linkRow;
		}
		else if (Framework.isString(linkRow))
		{
			rowsToLink[0] = parseInt(linkRow);
		}

		//Get the table to query.
		var hasTable = false;
		for (var table in Twoshoes.config.tables)
		{
			(function()
			{
				if (table == Twoshoes.query.table)
				{
					hasTable = true;
				}
			})(table);
		}

		if (!hasTable)
		{
			Twoshoes.debug('(E)link.hasTable', 'Table '+Twoshoes.query.table+' is not found', Twoshoes.debugError);
			return results;
		}

		//Do table lookup.
		var resultsRow = 0;
		for (var i = 0, j = Twoshoes.config.tables[Twoshoes.query.table].values.length; i < j; i++)
		{
			(function()
   			{
				var row = Twoshoes.config.tables[Twoshoes.query.table].values[i];
				Twoshoes.debug('(Q)link.row', row, Twoshoes.debugQuery);

				//Index the table row.
				var indexedRow = (function(){return Twoshoes.indexRow(row, Twoshoes.config.tables[Twoshoes.query.table].fields);})();

				//Not sure yet what the contigency is.
				if (Twoshoes.config.tables[Twoshoes.query.table].fields.length != row.length)
				{
					Twoshoes.debug('(Q)link.row', 'Fields length on table '+Twoshoes.query.table+' does not equal row length', Twoshoes.debugError);
				}

				//Test each condition.
				var passConditions = (function(){return Twoshoes.isWhere(indexedRow, Twoshoes.query.where);})();
				if (passConditions)
				{
					results[resultsRow] = i;
					affectedRows[resultsRow] = i; //this is doubling up of the information, might return something else from this function.
					resultsRow++;
				}
			})(i);
		}

		//Set the link action to the values table.
		for (var i = 0, j = rowsToLink.length; i < j; i++)
		{
			(function()
			{
				if (Twoshoes.setTableRowAction(linkTable, i, 'link', {name:Twoshoes.query.table,rows:results}) == false)
				{
					//Debug if set row action fails.
					Twoshoes.debug('(Q)insert.setTableRowAction error', false, Twoshoes.debugQuery);
				}
			})(i);
		}

		//Reset the query object.
		if (typeof memory == 'undefined' || !memory)
		{
			Twoshoes.query = {};
			Twoshoes.affected = [];
		}

		Twoshoes.affected = affectedRows;
		return results;
	},

	//*!*Need to put routie at the bottom of the object to do basic timer stuff for background task.
	//Executes the background task and sets the recursion period.
	// - period:			Number of milliseconds the next background task is fired
	// * return:			SELF
	backgroundTask : function(period)
	{
		//Check to see if the period is updated.
		if (period != Twoshoes.backgroundPeriod)
		{
			window.clearInterval(heartbeat);
			period = Twoshoes.backgroundPeriod;
			//if (period > 0) //Need to test the effect of setting the interval to zero
			heartbeat = window.setInterval(function(){Twoshoes.backgroundTask(period)}, period);
		}

		//Check tables and make requests to update values.
		if ((Twoshoes.backgroundPeriod != 0) && (Twoshoes.countActions() > 0))
		{
			var requestData = Twoshoes.helper('bootstrap').buildApiRequestTable();
			var responseData = Twoshoes.request('bootstrap').apiData({data:requestData});
		}

		return this;
	},


///////////////////////////////////////////////////////////////////////////////
//          T E M P L A T E   O P E R A T I O N   F U N C T I O N S          //
///////////////////////////////////////////////////////////////////////////////

//*!*There ill be a wrrapper which gets the template string and then passes it to this function

	//Need to figure out the local variable names which these values are added to
	//Sets the template string to be built.
	// - template:			Template string to set for building
	// * Return:			SELF
	plan : function (template)
	{
		//If the template is not defined create error.
		if (typeof template == 'undefined')
		{
			Twoshoes.debug('(E)plan.template', 'template not defined', Twoshoes.debugError);
		}
		//Else if the template is not a string create error.
		else if (!this.isString(template))
		{
			Twoshoes.debug('(E)plan.template', 'template is not a string', Twoshoes.debugError);
		}
		//Else if the template is empty create error.
		else if (!template)
		{
			Twoshoes.debug('(E)plan.template', 'template is an empty string', Twoshoes.debugError);
		}
		//Otherwise set the temlate locally for use.
		else
		{
			Twoshoes.debug('(B)plan.template', template, Twoshoes.debugBuild);
			Twoshoes.template = template;
		}

		return this;
	},

	//Binds the array values as gainst the keys to build the templete. - this an be described better
	// - variables:			Object property set of values to set as variables in the build template
	// - overwrite:			Flag to write over exsting variables which hae been set to the build, default overwrite
	// * Return:			SELF
	bind : function (variables, overwrite)
	{
		//If the variables are not defined create error.
		if (typeof variables == 'undefined')
		{
			Twoshoes.debug('(E)bind.variables', 'variables in not defined', Twoshoes.debugError);
		}
		//Else if the variables are false reset all locally bound variables.
		else if (variables === false)
		{
			Twoshoes.bound = [];
		}
		//Else if the variables are not an array create error. need to test for both object and array?
		else if (!Twoshoes.isObject(variables))
		{
			Twoshoes.debug('(E)bind.variables', 'variables are not an object', Twoshoes.debugError);
		}
		//Otherwise set each variable locally.
		else
		{
			Twoshoes.debug('(B)bind.variables', variables, Twoshoes.debugBuild);

			if (variables)
			{
				for (var key in variables)
				{
					//If the variable can be set then set it.
					if ((typeof overwrite != 'undefined' && overwrite) || (Twoshoes.bound[key] == 'undefined'))
					{
						Twoshoes.bound[key] = variables[key];
					}
				}
			}
		}

		return this;
	},

	//proceses a comment token, replces with an empty string
	processComments : function (matches)
	{

	},

	//processs an escape string, replaces text within two escape tags with an empty string
	processEscapes : function (matches)
	{

	},

	//processes a variable placeholder with it's string value
	//might do some additional functions here
	processVariables : function(matches)
	{

	},

	//Processes and if statement between if and endif, also does the else if it exists
	processControl : function(matches)
	{

	},

	//Processes an each tag to loop result between open and close tags
	processEach : function(matches)
	{

	},

	//cleans up the unopened ifelse tag
	removeIfElse : function(matches)
	{

	},

	//cleans up the unopened ifclose tag
	removeIfClose : function(matches)
	{

	},

	//cleans up the unopened eachclose tag
	removeEachClose : function(matches)
	{

	},

	//Adds the processed string to build stack and replaces current token with string token
	//string:build string, position, place within build stack that was processed
	addToStack : function(string, position)
	{

	},

	//need to implement the addToStack funcion within this, ned a generic way to put in template slices
	//EG; implementing inheritance
	buildStack : function(template)
	{
		Twoshoes.debug('(B)buildStack.template', template, Twoshoes.debugBuild);

		//Insert the values into the template.
		var pieces = new Array();
		var tokens = new Array();
		var folds = template.match(Twoshoes.regexBuildFold);
		if (folds)
		{
			//Split the template along the folds.
			var split = [];
			var splitOpen = 0;
			var splitClose = 0;
			var ticker = template;
			for (var i = 0, j = folds.length; i <= j; i++)
			{
				//Cut the template along the fold lines.
				if (i < j)
				{
					splitOpen = ticker.indexOf(folds[i], splitClose);
					split[i] = ticker.substring(splitClose, splitOpen);
					splitClose = splitOpen + folds[i].length;
					ticker = ticker.substring(splitClose);
				}
				//Get the last piece of the split template.
				else
				{
					split[i] = ticker;
				}

				//Set stack tokens and strings
				pieces[(i * 2)] = split[i];
				tokens[(i * 2)] = Twoshoes.tokens.string;

				if (i < j)
				{
					pieces[(i * 2) + 1] = folds[i];
					if (stringToken = folds[i].match(Twoshoes.regexVariable))
					{
						tokens[(i * 2) + 1] = Twoshoes.tokens.variable;
					}
					else
					{
						tokens[(i * 2) + 1] = Twoshoes.tokens.string;
					}
				}
			}

			Twoshoes.debug('(B)buildStack.pieces', pieces, Twoshoes.debugBuild);
			Twoshoes.debug('(B)buildStack.tokens', tokens, Twoshoes.debugBuild);

			//Set the ticker pieces and build stack to a single return array.
			stack = new Array();
			stack['pieces'] = pieces;
			stack['tokens'] = tokens;

			return stack;
		}

		return false;
	},

	getTokenCounts : function(stackTokens)
	{
		var tokenCounts = new Array();
		for (var label in Twoshoes.tokens)
		{
			var count = 0;
			for (var i = 0, j = stackTokens.length; i < j; i++)
			{
				if (Twoshoes.tokens[label] == stackTokens[i])
				{
					count++;
				}
			}

			tokenCounts[Twoshoes.tokens[label]] = count;
		}

		return tokenCounts;
	},

	//Builds a template to a string using the build stack
	//label, of the template to build. values, of variables set to the template
	//build : function(label, values) - this needs to be set in a wrapper function tat calls the standard plan.bind.build pattern
	build : function(label, values)
	{
		//for handling errors
		//Get the template string
		var template = Twoshoes.template;//test that this exists
		//get the values
		var values = Twoshoes.bound;

//these are to be put into the wrapper function
// 		//Set the action.
// 		this.buildName = label;
//
// 		//Get the template.
// 		template = this.widgets.label;


		var stack = Twoshoes.buildStack(Twoshoes.template);
		if (stack)
		{
			var processStack = true;
			while (processStack)
			{
				//Count arrays values.
				tokenCounts = Twoshoes.getTokenCounts(stack['tokens']);
//this.debug('(B)buildStack.tokenCounts', tokenCounts, this.debugBuild);

				//Process each token on priority.
				if (tokenCounts[Twoshoes.tokens.comment])
				{
					Twoshoes.processComments();
				}
				else if (tokenCounts[Twoshoes.tokens.escape])
				{
					Twoshoes.processEscapes();
				}
				else if (tokenCounts[Twoshoes.tokens.variable])
				{
					alert('asd');
					Twoshoes.processVariables();
				}
				else if (tokenCounts[Twoshoes.tokens.ifOpen])
				{
					//need to rejig this if else logic like the builder
					Twoshoes.processControl();
				}
				else if (tokenCounts[Twoshoes.tokens.eachOpen])
				{
					Twoshoes.processEach(matches[i][0]);
				}
				else
				{
					processStack = false;
				}

// 				//Remove unprocessed close tags.
// 				else if (matches[i][0] == this.tokenIfElse)
// 				{
// 					this.removeIfElse(matches[i][0]);
// 				}
// 				else if (matches[i][0] == this.tokenIfClose)
// 				{
// 					this.removeIfClose(matches[i][0]);
// 				}
// 				else if (matches[i][0] == this.tokenEachClose)
// 				{
// 					this.removeEachClose(matches[i][0]);
// 				}
			}
		}

		//Hold the template for use.
		//this.buildTemplate = stackToString();

		return this;
	},

	//This function is a very basic way to find a selector of a single element without having to use sizzle
	// - hook:				Selector string conatining the DOM object reference
	// * Return:	The three propertes of the element as an array of values: name, label, value
	// The "name" is the element type, nodeName of the element in the DOM
	// The "label" is the attribute of the eleemnt, the nodeName of the attribute in the DOM
	// The value is the attribute value, the nodeValue of the attribute in the dom
	// NB: There is no rigorous error checking of the selector string, it is assumed that this is well formed.
	//The format for this function should be ElementAttributeValue
	// ID:	div#myid
	// Class: div.myclass
	// Attr: div[attrname="myattr"] - quotes re optional
	//*!*There is a problem here where if I leave out the  tagname the script borks and make a blank http request
	getShortSelector : function(hook)
	{
		if (typeof hook == 'undefined')
		{
			var selector = new Array();
			selector['name'] = '';
			selector['label'] = '';
			selector['value'] = '';
			return selector;
		}

		//If the hook is an object simply return it.
		//*!*Need another test for elements and dom nodes, I don't have time to do this now.
		if (Twoshoes.isWindow(hook))
		{
			return hook;
		}

		//Need to do the split of the selector by the id, class or attribute
		var selector = new Array();
		if (hook.indexOf('.') != -1)
		{
			selector['name'] = hook.substr(0, hook.indexOf('.'));
			selector['label'] = 'class';
			selector['value'] = hook.substr(hook.indexOf('.') + 1, hook.length - 1);
		}
		else if (hook.indexOf('#') != -1)
		{
			selector['name'] = hook.substr(0, hook.indexOf('#'));
			selector['label'] = 'id';
			selector['value'] = hook.substr(hook.indexOf('#') + 1, hook.length - 1);
		}
		else if ((hook.indexOf('[') != -1) && (hook.indexOf(']') != -1) && (hook.indexOf('=') != -1))
		{
			selector['name'] = hook.substr(0, hook.indexOf('['));
			selector['label'] = hook.substr(hook.indexOf('[') + 1, hook.indexOf('=') - hook.indexOf('[') - 1);
			selector['value'] = hook.substr(hook.indexOf('=') + 1, hook.length - hook.indexOf('=') - 2);
			selector['value'] = selector['value'].replace(/"/g, '');
			selector['value'] = selector['value'].replace(/'/g, '');
		}
		else
		{
			selector['name'] = hook;
			selector['label'] = '';
			selector['value'] = '';
		}

		return selector;
	},

	//Determines if an element matches the selector string.
	// - element:
	// - shortSelector:
	// * Return:				True if short selector matches the element, otherwise false
	isShortSelector : function(element, shortSelector)
	{
		//If the tag name of the eeemnt doese not match.
		if (shortSelector['name'] != '' && (jQuery(element).prop('tagName') != shortSelector['name'].toUpperCase()))
		{
			return false;
		}

		if ((shortSelector['label'] == 'class') && (!jQuery(element).hasClass(shortSelector['value'])))
		{
			return false;
		}

		if ((shortSelector['label'] != 'class') && (shortSelector['label'] != '') && (jQuery(element).attr(shortSelector['label']) != shortSelector['value']))
		{
			return false;
		}

		return true;
	},


///////////////////////////////////////////////////////////////////////////////
//      T E M P L A T E   M A N I P U L A T I O N   F U N C T I O N S        //
///////////////////////////////////////////////////////////////////////////////

//these should not even be functions
//not sure if these are to be template dirctives or not.
	replace : function(content)
	{

	},

	append : function(content)
	{

	},

	prepend : function(content)
	{

	},



///////////////////////////////////////////////////////////////////////////////
//                         A P I   F U N C T I O N S                         //
///////////////////////////////////////////////////////////////////////////////

	//Gets the route gouping dispatch functions.
	// - group:				Name of routes group as a atring
	// - Return:			Object of dispatch functions linked as properties to route name
	route : function(group)
	{
		//Validate the group.
		if (!Twoshoes.isString(group))
		{
			Twoshoes.debug('(E)route.group', 'group not a string', Twoshoes.debugError);
			return this;
		}

		//Assign group reference.
		Twoshoes.behave.group = group;

		return this;
	},

	//Modifies an existing configured route.
	// - route:				Name of the route to modify in registry
	// - config:			New configuration parameters to add/replace in registry
	// * Return:			Twoshoes global object
	// * NB: If there is no route and the cnfig is valid then it is added to th registry
	// * NB: Group name needs to be defined before calling the route
	//We should be ble to set route to false so that all routes within a group can be changed
	adapt : function(route, config)
	{
		//If the configuration is not supplied then push out an error.
		//I may add functionality here instead at some time in the future.
		if ((typeof config == 'undefined') || (!Twoshoes.isObject(config)) || (Twoshoes.count(config) == 0))
		{
			Twoshoes.debug('(E)adapt.config', 'config not an object with properties', Twoshoes.debugError);
			return this;
		}

		//If there is no defined group handle exception, or modify all routes with same name???
		if (typeof Twoshoes.behave.group == 'undefined')
		{
			return this;
		}

		//Get matching group name.
		for (var group in Twoshoes.config.routes)
		{
			(function()
			{
				if (group == Twoshoes.behave.group)
				{
					//Get match route name.
					for (var name in Twoshoes.config.routes[group])
					{
						(function()
						{
							if (route == name)
							{
								//Update properties of route.
								var updateProperties = {};

								//Look for a change in the event type.
								var previousEvent = '';
								if (typeof Twoshoes.config.routes[group][name].event != 'undefined')
								{
									//If there is a new event and it is recognised update it.
									if ((typeof config.event != 'undefined')
									&& (Twoshoes.config.routes[group][name].event != config.event)
									&& (jQuery.inArray(config.event, Twoshoes.routeEvents) != -1))
									{
										previousEvent = Twoshoes.config.routes[group][name].event;
									}
								}

								//Assemble the new event object
								var adaptedEvent = Twoshoes.config.routes[group][name];

								//Change the event in the global config.
								for (var property in config)
								{
									(function()
									{
										adaptedEvent[property] = config[property];
									})(group, name, property);
								}

								//Update the event in the global config.
								if (typeof Twoshoes.config.routes[group] == 'undefined')
								{
									Twoshoes.config.routes[group] = {};
								}

								Twoshoes.config.routes[group][name] = adaptedEvent;

								//Update the event registry.
								for (var event in Twoshoes.eventRegistry)
								{
									(function()
									{
										//Remove od event from registry.
										if (previousEvent != '')
										{
											delete Twoshoes.eventRegistry[previousEvent][group][name];
										}

										//Look for and replace position of the new event.
										if (typeof Twoshoes.eventRegistry[event][group] == 'undefined')
										{
											Twoshoes.eventRegistry[event][group] = {};
										}

										//*!*Right here I will want a parameter to overwrite existing event.
										//This is the same for the config, needed to use this function safely
										Twoshoes.eventRegistry[adaptedEvent.event][group][name] = adaptedEvent;
									})(group, name, event);
								}
							}
						})(group, name);
					}
				}
			})(group);
		}


		return this;
	},

	//Invokes the route trigger.
	// - route:				Name of the route to modify in registry
	// - config:			Modifications to the route, if true send route straight into dispatch
	// * Return:			Twoshoes global object
	// * NB: Group name needs to be defined before calling the route
	// * NB: The property: config.invoke = ture; can be set to force event to dispatch.
	invoke : function(route, config)
	{
		//Validate the configuration.
		if (typeof config == 'undefined')
		{
			config = {};
		}

		//Get matching group name.
		for (var group in Twoshoes.config.routes)
		{
			(function()
			{
				//If ths is a matching group.
				if ((typeof Twoshoes.behave.group == 'undefined') || (group == Twoshoes.behave.group))
				{
					//Get match route name.
					for (var name in Twoshoes.config.routes[group])
					{
						(function()
						{
							//If this is a matching route.
							if ((route == false) || (route == name))
							{
								//Build config from parameter object and registered object.
								var registeredRoute = Twoshoes.config.routes[group][route];
								for (var property in config)
								{
									(function()
									{
										//If the target is a reference get the first match.
										if ((property == 'target') && (!Twoshoes.isHtmlElement(config[property])))
										{
											//*!*there's going to be a case when user derps and passing proper object to this
											if ((!Twoshoes.isObject(config[property]))
											|| (!Twoshoes.isArray(config[property])))
											{
												config[property] = jQuery[0];
											}
											else if (!Twoshoes.isString(config[property]))
											{
												config[property] = jQuery(config[property])[0];
											}
										}

										//Get all subject elements.
										if ((property == 'subject') && (!Twoshoes.isString(config[property])))
										{
											config[property] = jQuery(config[property]);
										}

										registeredRoute[property] = config[property];
									})(group, route, property);
								}

								//If the route is not a path dispatch the event.
								if (typeof registeredRoute.path == 'undefined')
								{
									//If the force invoke option is true then validate and dispatch event.
									if ((typeof config.invoke != 'undefined') && (config.invoke))
									{
										registeredRoute.dispatch(registeredRoute.target, registeredRoute.subject);
									}
									//Otherwise trigger an event to send to the dispatch.
									else
									{
//I'm going to let this go for now and do a big refactor of the dispatch later.
//What's happening is we are sending to the dispatch all the events and the loop there is
//firing the "valid" event(actully a path) in the event list, even though it is not actually valid.
//Why is the path firing, indeed. Must test I didn't break event handling
										var event = jQuery.Event(registeredRoute.type);
										event.data = {};
										event.data.type = (typeof registeredRoute.type != 'undefined')? registeredRoute.type: false;
										event.data.routes = Twoshoes.config.routes;
										event.data.builder = Twoshoes.getShortSelector;
										Twoshoes.dispatch(event);
									}
								}
								//Otherwise invoke the path.
								else
								{
									registeredRoute.dispatch();
								}
							}
						})(group, name);
					}
				}
			})(group);
		}

		return this;
	},

	//event type which is being registered
	//*!*group has not been reconciled.
	request : function(group)
	{
		if (typeof Twoshoes.config.requests[group] == 'undefined')
		{
			//do error handling.
			return false;
		}

		//Build the request handler object.
		var requestHandler = {};
		for (var name in Twoshoes.config.requests[group])
		{
			//Get default request configuration.
			var config = Twoshoes.config.requests[group][name];
			(function(name, config)
			{
				//Create property function.
				requestHandler[name] = function(modifiers, callback)
				{
					if (typeof modifiers == 'undefined')
					{
						modifiers = {};
					}

					//Look through the supplied configuration and replace for any updates.
					//*!*Ideally we need to be running some validation over these values to make sure they will plug into jquery ajax
					if (Twoshoes.isObject(modifiers) && Twoshoes.count(modifiers) > 0)
					{
						//*!*This for loop needs more ganularity for the options on the api
						for (var modifier in modifiers)
						{
							(function(modifier)
							{
								config[modifier] = modifiers[modifier];
							})(modifier);
						}
					}

					//Get the method of request.
					if (config.method == 'undefined')
					{
						config.method = 'ajax';
					}

					//*!*Need to validate the values of the config object for the request type.
					//Need to test the data type, if it is not json then do a conversion of the values.
					//*!*I should probably validate these properly.
					if (config.type == 'undefined')
					{
						config.type = 'GET';
					}

					//Not sure whether this should be the same property type.
					if (config.dataType == 'undefined')
					{
						config.dataType = 'json';
					}

					//Need t check that these are functions not any other type of value.
					if (config.beforeSend == 'undefined')
					{
						config.beforeSend = function(){};
					}
					else if (!Twoshoes.isFunction(config.beforeSend))
					{
						//handle error.
						config.beforeSend = function(){};
					}

					if (config.success == 'undefined')
					{
						config.success = function(){};
					}
					else if (!Twoshoes.isFunction(config.success))
					{
						//handle error.
						config.success = function(){};
					}

					if (config.error == 'undefined')
					{
						config.error = function(){};
					}
					else if (!Twoshoes.isFunction(config.error))
					{
						//handle error.
						config.error = function(){};
					}

					if (config.complete == 'undefined')
					{
						config.complete = function(){};
					}
					else if (!Twoshoes.isFunction(config.complete))
					{
						//handle error.
						config.complete = function(){};
					}

					if (group != 'undefined')
					{

					}

					//*!*This is where the modifier logic gos in, for now we are just doing a straight replace.
					if (config.data == 'undefined')
					{
						config.data = {};
					}

					//Make the request from the config variables.
					//*!*Need to add all jquery paramters to this function call.
					var result = [];
					switch (config.method)
					{
						case 'ajax':
							jQuery.ajax(
							{
								url : config.action,
								type : config.type,
								data : config.data,
								dataType : config.dataType,
								beforeSend : config.beforeSend,
 								success : config.success,
								error : config.error,
								complete : config.complete
							});
						break;
					}
				}
			})(name, config);
		}

		return requestHandler;
	},

	//conditional handle(dom object-xpath) that determines whether an action is triggered
	// - values:			Object of values as properties to set to the widget
	// - set:				not sure what this is supposed to be
	// * return:			SELF
	widget : function(values, set)
	{
		return this;
	},

	//state(class) of the handle that enables the event to be triggered
	//should this be here, I think not.
	//Need to do an include routine with the "set" parameter when "obj" is a string like in the config area
	plugin : function(obj, set)
	{
		//Get the plugin, don't set it.
		if (Twoshoes.isString(obj))
		{
			var pluginTarget = false;
			for (var label in Twoshoes.config.plugins)
		   	{
				(function()
				{
					if (label == obj)
					{
						pluginTarget = Twoshoes.config.plugins[label].target;
					}
				})(label);
			}

			return jQuery(pluginTarget);
		}

		//*!*This should probably be return false.
		return this;
	},

	//Gets the helper object in the named configuration group.
	// - name:					Name of the configuration group to retrieve
	// * Return:				Configuration helper object set under name
	helper : function(name)
	{
		if (typeof Twoshoes.config.helpers[name] == 'undefined')
		{
			//do error handling.
			return false;
		}

		return Twoshoes.config.helpers[name];
	},

	//Load scripts prior to ready call.
	// - scripts:			String or an array of strings of the script names as to load
	// - url:				Base url directory to load from
	// - together:			Boolean switch to loads scripts asynchronously or synchronously
	// - callback:			Callback function to execute after scripts are successfully loaded
	// * Return:			SELF
	//*!*What I would also like to do is to be able to set a callback once the entire batch of scripts are loaded.
	//This way I can async all the scipts and then fire the callback to this, the callback needs to be called
	//onced all the scripts are loaded. I will implement this before the current project goes live but not before
	//as it needs performance testing.
	loadScripts : function(scripts, url, together, callback)
	{
		jQuery.holdReady(true);
		var loaded = [];

		//Set asynchronous to default
		var async = true;
		if (typeof together != 'undefined')
		{
			async = together;
		}

		//If scripts is a string turn it into an array.
		var scriptsToLoad = (Twoshoes.isString(scripts))? [scripts]: scripts;

		//Validate the URL.
		if (typeof url == 'undefined')
		{
			url = '';
		}

		//Load each script via ajax.
		jQuery.each(scriptsToLoad, function(key, value)
		{
			jQuery.ajax({
				url : url+value,
				dataType : "script",
				async : async,
				success : function()
				{
					(function(value)
					{
						if (async)
						{
							//Check all scripts have been loaded.
							scriptsLoaded = loaded.push(value);
							if (scriptsLoaded == scriptsToLoad.length)
							{
								jQuery.holdReady(false);
							}
						}
					})(value);
				},
				error : function()
				{
					alert('Script: '+ value +' failed to load');
				}
			});
		});

		return this;
	},

	//Runs unittests from the test bootstrap file.
	// - tests:			Array of test script names as strings to run
	test : function(tests)
	{
		//Run the test bootstrap file.
		
		return this;
	},


///////////////////////////////////////////////////////////////////////////////
//                     H E L P E R   F U N C T I O N S                       //
///////////////////////////////////////////////////////////////////////////////

	//These functions should just use the jquery versions where possible.
	//*!*Much of these functions will make their way into helpers eventully.

	//*!*Add to documentation, not sure I want or need this function. Might put it in a helper
	//Tests variablee is a valid property name.
	// - variable:				String or number to test as property name
	// * Return:				True if variale is a valid property name, otherwise false
	// * ES5.1 / Unicode 6.1, Regexp from Mathias Bynens, http://mothereff.in/js-properties#12e34
	isPropertyName : function(variable)
	{
		var propertyRegexp = /^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[$A-Z\_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc][$A-Z\_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19b0-\u19c0\u19c8\u19c9\u19d0-\u19d9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f]*$/

		if (Twoshoes.isInteger(variable))
		{
			variable = variable.toString();
		}

		if (Twoshoes.isString(variable) && (variable.match(propertyRegexp)))
		{
			return true;
		}

		return false;
	},

	//Test if variable is an html element object.
	// - variable:				Value to test is an html element object
	// * Return:				True if variable is an html element, otherwise false
	isHtmlElement : function(variable)
	{
		if ((Object.prototype.toString.call(variable) === '[object HTMLElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLAnchorElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLAreaElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLAudioElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLBRElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLBaseElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLBodyElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLButtonElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLCanvasElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLCollection]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLCommandElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLDListElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLDataListElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLDetailsElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLDivElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLDocument]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLEmbedElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLFieldSetElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLFormControlsCollection]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLFormElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLHRElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLHeadElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLHeadingElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLHtmlElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLIFrameElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLImageElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLInputElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLKeygenElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLLIElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLLabelElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLLegendElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLLinkElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLMapElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLMediaElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLMenuElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLMetaElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLMeterElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLModElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLOListElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLObjectElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLOptGroupElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLOptionElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLOutputElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLParagraphElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLParamElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLPreElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLProgressElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLQuoteElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLScriptElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLSelectElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLSourceElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLSpanElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLStyleElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableCaptionElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableCellElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableColElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableDataCellElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableHeaderCellElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableRowElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTableSectionElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTextAreaElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTimeElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTitleElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLTrackElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLUListElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLUnknownElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLVideoElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLAppletElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLBaseFontElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLDirectoryElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLFontElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLFrameElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLFrameSetElement]')
		|| (Object.prototype.toString.call(variable) === '[object HTMLIsIndexElement]'))
		{
			return true;
		}

		return false;
	},

	//Test if variable is a javascript object object.
	// - variable:				Value to test is an object object
	// * Return:				True if variable is an object object, otherwise false
	isObject : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Object]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is a javascript function object.
	// - variable:				Value to test is a function object
	// * Return:				True if variable is a function object, otherwise false
	isFunction : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Function]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is an array function object.
	// - variable:				Value to test is an array object
	// * Return:				True if variable is an array object, otherwise false
	isArray : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Array]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is a regular expression object.
	// - variable:				Value to test is a regular exression object
	// * Return:				True if variable is a regular exression object, otherwise false
	isRegExp : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object RegExp]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is a string object.
	// - variable:				Value to test is a string object
	// * Return:				True if variable is a string object, otherwise false
	isString : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object String]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is a number object.
	// - variable:				Value to test is a number object
	// * Return:				True if variable is a number object, otherwise false
	isNumber : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Number]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is a non floatng point number object.
	// - variable:				Value to test is a non floatng point number object
	// * Return:				True if variable is a non floatng point number object, otherwise false
	isInteger : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Number]')
		{
			if (variable.toString().split('.').length == 1)
			{
				return true;
			}
		}

		return false;
	},

	//Test if variable is a floatng point number object.
	// - variable:				Value to test is a floatng point number object
	// * Return:				True if variable is a floatng point number object, otherwise false
	isFloat : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Number]')
		{
			if (variable.toString().split('.').length == 2)
			{
				return true;
			}
		}

		return false;
	},

	//Test if variable is a boolean object.
	// - variable:				Value to test is a boolean object
	// * Return:				True if variable is a boolean object, otherwise false
	isBoolean : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Boolean]')
		{
			return true;
		}

		return false;
	},

	//Test if variable is the user agent window object.
	// - variable:				Value to test is the user agent window object
	// * Return:				True if variable is the user agent window object, otherwise false
	isWindow : function(variable)
	{
		if (Object.prototype.toString.call(variable) === '[object Window]')
		{
			return true;
		}

		return false;
	},

	//Counts the number of indexes in an array or properties in an object
	// - variable:				Value to count length of the array or object
	// * Return:				Number of indexes in the array or properties of the object, or false if not an array or object
	count : function(variable)
	{
		if (Twoshoes.isArray(variable) == true || Twoshoes.isObject(variable) == true)
		{
			var count = 0;
			//I haven't tested this enclosure yet, it should behave correctly.
			for (var key in variable)
			{
				count++;
			}

			return count;
		}

		return false;
	},

	//Gets the values of an indexed array.
	// - array:			Key/values array or object to get values from
	// - indexes:		Optional parameter to define which values are extracted and their return order
	// * Return:		Array of values numerically indexed
	//*!*This function should also handle object property sets, need to test.
	arrayValues : function(array, indexes)
	{
		values = [];
		count = 0;

		//If indees are supplied match return values in order of indexes.
		if (typeof indexes != 'undefined')
		{
			for (var i = 0, j = indexes.length; i < j; i++)
			{
				(function()
				{
					for (var key in array)
					{
						(function()
						{
							if (key == indexes[i])
							{
								values[count] = array[key];
								count++;
							}
						})(i, key);
					}
				})(i);
			}
		}
		//Otherwise get array values in supplied order.
		else
		{
			for (var key in array)
			{
				(function()
				{
					values[count] = array[key];
					count++;
				})(key)
			}
		}

		return values;
	},

	//Gets the keys of an indexed array.
	// - array:			Key/values array or object to get values from
	// - values:		Optional parameter to define which keys are extracted whoes value matches those in the array supplied
	// * Return:		List of values numerically indexed
	//*!*This function should also handle object property sets, need to test.
	arrayKeys : function(array, values)
	{
		var keys = [];

		//Test that the array is an array or object.
		//Test that the value are an array.

		var count = 0;
		for (var key in array)
		{
			(function()
			{
				//If matching values are supplied then check that the value exists.
				if (typeof values != 'undefined')
				{
					if (jQuery.inArray(array[key], values) != -1)
					{
						keys[count] = key;
						count++;
					}
				}
				//Otherwise add the key to the return array.
				else
				{
					keys[count] = key;
					count++;
				}
			})(count);
		}

		return keys;
	},

	//Remaps the form input values as an indexed object.
	// - form:			Form element to remap values
	// - names:				Array of form names to remap values to
	// - indexes:			Array of indexs corrosponding with form names to build map
	// * Return:			Object of form values set to supplied indexes
	// * NB: This helper should really be part of the form handling plugin
	//*!*I have not done checkboxes.
	remapInputs : function(inputs, names, indexes)
	{
		//Validation checks, names same length as indexes, two or more same values are not supplied in each array.

		var map = {};
		jQuery.each(inputs, function(key, input)
		{
			//Find input name in supplied list of names.
			var name = jQuery(input).attr('name');
			for (var i = 0, j = names.length; i < j; i++)
			{
				(function()
    			{
					//If found add to index map.
					if (name == names[i])
					{
						map[indexes[i]] = jQuery(input).val();
					}
			    })(i);
			}
		});

		return map;
	},
	
	//Also want to add more funcionality than php to us an array of values as the parameter, or multiple parameters
	//*!*Fr now we just do one string
	//Converts the first character of a string to uppercase.
	// - string:				String to tranform first character to upper case
	// * Return:				String with first character transformed to upper case
	ucfirst : function(string)
	{
		//If the parameter is not a string then do error.
		var result = string.substr(0, 1).toUpperCase() + string.substr(1, string.length);
		return result;
	}

};

