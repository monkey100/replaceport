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
			//Add new projects into an array of deep project data objects for interfce building refernce
			assembleProjects :function(projectData, assembledProjects)
			{
				var projectCount = Twoshoes.count(projectData);
				jQuery.each(projectData, function(dataIndex, data)
				{
					var projectAssebled = false;
					jQuery.each(assembledProjects, function(projectIndex, project)
					{
						if (data.key == project.key)
						{
							projectAssebled = true;
						}
					});

					if (!projectAssebled)
					{
						assembledProjects[projectCount - 1] = data;
						projectCount++;
					}
				});

				return assembledProjects;
			},
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
			//Adds projects to quick looup table.
			addProjectsToTable : function(projects)
			{
				var addedProjects = [];
				var projectsAdded = 0;

				jQuery.each(projects, function(index, project)
				{
					var results = Twoshoes.table('projects').where(['key', 'eq', project.key]).select();

					if (results == false)
					{
						var fields = Twoshoes.table('projects').fields();
						var values = [project.key, project.title, project.owner, project.version, project.created, project.summary, project.description, project.image, project.thumbnail, project.totaldownloads, project.monthlydownloads, project.rating, project.followers];
						Twoshoes.table('projects').insert(values, fields);
						addedProjects[projectsAdded] = project;
						projectsAdded++;
					}
				});
				
				return addedProjects;
			},
			addUsersToTable : function(apiData)
			{

			}
		},
		widgets :
		{
			displayIndexPage : function()
			{
				//Show index frame.
			 	var widget = Mustache.to_html(jQuery('#index_page').html());
				jQuery('#main_pane').html(widget);

				//Dsiplay index widgets.
				Twoshoes.helper('widgets').displayProjectsByDownloaded(Twoshoes.get('downloaded'));
				Twoshoes.helper('widgets').displayProjectsByRated(Twoshoes.get('rated'));
				Twoshoes.helper('widgets').displayProjectsByReleased(Twoshoes.get('released'));
			},
			displayProjectsByDownloaded : function(projects)
			{
				var widget = '';
				jQuery.each(projects, function(index, project)
				{
					widget += Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
				});

				jQuery('#mostpopular').html(widget);
//*!*add ratings, look at twoshoes api code for invocation
//Twoshoes.plugin('projectRating').init({target:'div.project_'+key+' span.rating'})

			},
			displayProjectsByRated : function(projects)
			{
				var widget = '';
				jQuery.each(projects, function(index, project)
				{
					widget += Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
				});

				jQuery('#toprated').html(widget);
			},
			displayProjectsByReleased : function(projects)
			{
				var widget = '';
				jQuery.each(projects, function(index, project)
				{
					widget += Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
				});

				jQuery('#latestreleases').html(widget);
			},
			displayProjectView : function(project)
			{
				//Primary display.
			 	var panels = Mustache.to_html(jQuery('#project_description').html(), project);
				jQuery('#main_pane').html(panels);

				//Display summary.
			 	var brief = Mustache.to_html(jQuery('#catalog_item_brief').html(), project);
				jQuery('#item_brief').html(brief);

				//Tabs list
				var menu = Twoshoes.helper('project').getProjectTabsList(project);
			 	var tabs = Mustache.to_html(jQuery('#project_tabs').html(), {'menu':menu});
				jQuery('#tabs_pane div.tabs').html(tabs);

				//Downloads history
				var files = Twoshoes.helper('project').getProjectFilesByType(project, 'zip');
			 	var downloads = Mustache.to_html(jQuery('#project_files').html(), {'files':files});
				jQuery('#file_pane').html(downloads);

				//Changelogs
				var changes = Twoshoes.helper('project').getProjectChangelogs(project);
				var changelogs = Mustache.to_html(jQuery('#project_changelog').html(), {'changes':changes});
				jQuery('#tabs_pane div.changelog').html(changelogs);

				//Comments
				var remarks = Twoshoes.helper('project').getProjectComments(project);
				var comments = Mustache.to_html(jQuery('#project_comments').html(), {'remarks':remarks});
				jQuery('#tabs_pane div.comments').html(comments);
			},
			displayCategoryList : function(categories)
			{
				//Not doing menu ordering yet.
				var menuItems = [];
				var count = 0;
				for (var key in categories)
				{
					(function()
					{
						var item = {
							key : categories[key][2],
							title : categories[key][3],
							brief : categories[key][4],
							children : ''
						}

						if (Twoshoes.count(categories[key]['children']) > 0)
						{
							item['children'] = Twoshoes.helper('widgets').displayCategoryList(categories[key]['children']);
						}

						var menuItem = Mustache.render(jQuery('#category_menu_item').html(), item);
						menuItems[count] = menuItem;

						count++;
					})(key, count);
				}

				return '<ul style="display:none;">'+menuItems.join('')+'</ul>';
			},
			displayGlobalWidgets : function()
			{
 				var registerForm = Mustache.render(jQuery('#register_widget').html(), {});
				jQuery('#register_panel').html(registerForm);

 				var loginForm = Mustache.render(jQuery('#login_widget').html(), {});
				jQuery('#login_panel').html(loginForm);
			},

			displayCategoryMenu : function()
			{
 				var menu = Twoshoes.helper('widgets').displayCategoryList(Twoshoes.get('categories'));
				jQuery('#catg_pane').html(menu);
				jQuery('#catg_pane > ul').attr('id', 'category_menu').show();
				Twoshoes.updatePlugins();
			},
			displaySearchPage : function()
			{
				var widget = Mustache.to_html(jQuery('#search_page').html());
				jQuery('#main_pane').html(widget);

	 			var filters = Mustache.to_html(jQuery('#search_filters').html(), {});
	 			jQuery('#filt_pane').html(filters);

	 			var pagination = Mustache.to_html(jQuery('#search_paginagtion').html(), {});
	 			jQuery('#tpag_pane').html(pagination);
	 			jQuery('#bpag_pane').html(pagination);

				var projects = Twoshoes.get('projects'); //*!*Temp value for design
	 			var results = '';
				jQuery.each(projects, function(index, project)
				{
					results += Mustache.to_html(jQuery('#catalog_item').html(), project);
				});

	 			jQuery('#search_results').html(results);


			}
		}
	}
});
