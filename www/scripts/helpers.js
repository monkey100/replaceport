//helpers.js

Twoshoes.init(
{
	helpers : {
		bootstrap : {
		    buildApiResponseTable : function(apiData)
			{
				//If table data has been sent back from the api get it.
				//*!*This code block seems to be fucked. - throwing an error.

				//*!*Why am i asking for tabes?
				if (apiData.hasOwnProperty('tables'))
				{
					var configTables = {};
					for (var tableName in apiData.tables)
					{
						(function(tableName)
						{
							configTables[tableName] = apiData.tables[tableName];
						})(tableName);
					}

					//Set tables to the config.
					Framework.init({tables:configTables});
				}
		    },

			//Fills an empty array to overcome the ajax values bug which corrupts an entire array when converting to a json object.
			// - value:			Variable to chec and correct empty arrays.
			// * Return:		The value supplied with all empty arrays filled as null values.
			// * NB: Null values get passed by jQuery request as an empty string.
		    fillEmptyArrays : function(value)
		    {
				if (Framework.isArray(value) || Framework.isObject(value))
				{
					//If the array is empty assign it a null value.
					if (Framework.count(value) == 0)
					{
						value = null;
					}
					//Otherwise loop through the array to find and fill empty arrays.
					else
					{
						for (var key in value)
						{
							(function()
							{
								value[key] = Framework.helper('bootstrap').fillEmptyArrays(value[key]);
							})(key);
						}
					}
				}

				return value;
			},

			//*!*Will be removing reference to the values registry here. The registry i to keep the vlues as they were on init
		    buildApiRequestTable : function()
		    {
				var apiData = {};
				var where = ['modified', 'neq', '']; //Modified condition.

//*!*shortcut
apiData.tables = Framework.helper('bootstrap').fillEmptyArrays(Framework.config.tables);
return apiData;
				//*!*This needs to be don and all empty arrays need to be replaced by a null placeholder

				//*!*I believe th major issue I'm having is the usee of objects an arrays simultaneously in the ssame level of
				//The tree is confusing the jqurey json routine to drop whatever type is not the first

				//Do query on each table to find new or updated entries.
				//*!*Rmember to make these return values into an object no an array
				for (var table in Framework.config.tables)
				{
					(function (table)
					{
					    //var results = Framework.table(table).where(where).order('created', 'asc').select();
					    var results = Framework.table(table).select();
						if (Framework.count(results) > 0)
						{
							var data = [];
							data['fields'] = Framework.valueRegistry[table].fields;
							data['values'] = results;
							apiData[table] = data;
						}
					})(table);
				}

				return apiData;
			}
		},
		transaction :
		{
			setCategoriesToTable : function(apiData)
			{
				//This needs to be st as a accessor variable.
				if (typeof apiData.categories != 'undefined')
				{

				}
			},
			setTagsToTable : function(apiData)
			{
				if (typeof apiData.tags != 'undefined')
				{

				}
			},
			addProjectsToTable : function(apiData)
			{

			},
			addUsersToTable : function(apiData)
			{

			}
		},
		widgets : 
		{
			displayIndexPage : function(apiData)
			{
			 	var widget = Mustache.to_html(jQuery('#index-page').html());
				jQuery('#main_pane').html(widget);

				Twoshoes.helper('widgets').displayProjectsByDownloaded(apiData);
				Twoshoes.helper('widgets').displayProjectsByRated(apiData);
				Twoshoes.helper('widgets').displayProjectsByReleased(apiData);
			},
			displayProjectsByDownloaded : function(apiData)
			{
				var widget = '';
				if (typeof apiData.downloaded != 'undefined')
				{
					jQuery.each(apiData.downloaded, function(index, project)
					{
						widget += Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
					});
				}
				else
				{
					//display no project downloaded yet
				}

				jQuery('#mostpopular').html(widget);
//*!*add ratings, look at twoshoes api code for invocation
//Twoshoes.plugin('projectRating').init({target:'div.project_'+key+' span.rating'})

			},
			displayProjectsByRated : function(apiData)
			{
				var widget = '';
				if (typeof apiData.rated != 'undefined')
				{
					jQuery.each(apiData.rated, function(index, project)
					{
						widget += Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
					});
				}
				else
				{
					//display no project rated yet
				}

				jQuery('#toprated').html(widget);
			},
			displayProjectsByReleased : function(apiData)
			{
				var widget = '';
				if (typeof apiData.released != 'undefined')
				{
					jQuery.each(apiData.released, function(index, project)
					{
						widget += Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
					});
				}
				else
				{
					//display no project released yet
				}

				jQuery('#latestreleases').html(widget);
			}
		}
	}
});
