//requests.js

Twoshoes.init(
{
	requests : {
		bootstrap : {
			//Interface initialisation request.
			init : {
				method : 'ajax',
				type : 'GET',
	        	action : domainUrl+'api/?gui=page',
	        	data : {},
	        	format : 'json',
	        	error : function()
				{
	            	alert('Request failed');
				},
	        	success : function(response)
				{
					//Get the application state.

					//Set the projects locally.
					var projects = [];
					if (typeof response.downloaded != 'undefined')
					{
						Twoshoes.set('downloaded', response.downloaded);
						var addedProjects = Twoshoes.helper('transaction').addProjectsToTable(response.downloaded);
						projects = Twoshoes.helper('transaction').assembleProjects(response.downloaded, projects);
					}

					if (typeof response.rated != 'undefined')
					{
						Twoshoes.set('rated', response.rated);
						var addedProjects = Twoshoes.helper('transaction').addProjectsToTable(response.rated);
						projects = Twoshoes.helper('transaction').assembleProjects(response.rated, projects);
					}

					if (typeof response.released != 'undefined')
					{
						Twoshoes.set('released', response.released);
						var addedProjects = Twoshoes.helper('transaction').addProjectsToTable(response.released);
						projects = Twoshoes.helper('transaction').assembleProjects(response.released, projects);
					}

					//Store project data for viewing.
					Twoshoes.set('projects', projects);

					//Set formatted categories.
					if (typeof response.categories != 'undefined')
					{
						Twoshoes.set('categories', response.categories);
					}

					//Set all tags.
					if (typeof response.tags != 'undefined')
					{
						Twoshoes.set('tags', response.tags);
					}

					//Set user informtion.
					if (typeof response.user != 'undefined')
					{
						Twoshoes.set('user', response.user);
					}


					//Twoshoes.helper('bootstrap').buildApiResponseTable(response);
					//Set projects data to interface.

					//Start background tasks.
					//var period = heartbeat;
					//heartbeat = window.setInterval(function(){Twoshoes.backgroundTask(period)}, period);

					//Display homepage, will need to path for offsite url memory.
					Twoshoes.route('pages').invoke('home');
					Twoshoes.route('pages').invoke('initialise');
				}
			}
		},

		app : {
			transact : {
				method : 'ajax',
				type : 'POST',
	        	action : domainUrl+'api/',
	        	data : {},
	        	format : 'json',
	        	error : function()
				{
	            	alert('Request failed');
				},
	        	success : function(response)
				{

				}
			},
			contact : {
				method : 'ajax',
				type : 'POST',
	        	action : domainUrl+'contact/',
	        	data : {},
	        	format : 'json'
			}
		}
	}
});
