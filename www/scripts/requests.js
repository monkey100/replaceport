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

					//Twoshoes.helper('bootstrap').buildApiResponseTable(response);
					//Set projects data to interface.
// tags
// users
// categories

					//Start background tasks.
					//var period = heartbeat;
					//heartbeat = window.setInterval(function(){Twoshoes.backgroundTask(period)}, period);

					//Display homepage, will need to path for offsite url memory.
					Twoshoes.route('pages').invoke('home');
				}
			},

			//API data handling request.
			apiData : {
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
					//*!*Need to check for the success variable to confirm data has been saved. - need to set this in the API routine.
					Twoshoes.helper('bootstrap').buildApiResponseTable(response);
				}
			},
		},

		app : {
			//Calculation data handling request.
			calculateData : {
				method : 'ajax',
				type : 'POST',
	        	action : domainUrl+'calculate/',
	        	data : {},
	        	format : 'json',
	        	beforeSend : function()
	        	{
					//Add overlay and hide interface.
		            jQuery('#overlay').fadeIn();
					jQuery('#wrapper').fadeOut();
				},
	        	error : function()
				{
					//Remove overlay and display interface.
		            jQuery('#overlay').fadeOut();
					jQuery('#wrapper').fadeIn();

	            	alert('Request failed');
				},
	        	success : function(response)
				{
					//Remove overlay and display interface.
		            jQuery('#overlay').fadeOut();
					jQuery('#wrapper').fadeIn();

					//Set results to the interface.
					Twoshoes.helper('widgets').setCalulationOutputs(response.outputs);
				}
			}

		}
	}
});
