//requests.js

Twoshoes.init(
{
	requests : {
		bootstrap : {
			//Interface initialisation request.
			init : {
				method : 'ajax',
				type : 'GET',
	        	action : domainUrl+'api/',
	        	data : {},
	        	format : 'json',
	        	error : function()
				{
	            	alert('Request failed');
				},
	        	success : function(response)
				{
					//Get the application state.
					Twoshoes.helper('bootstrap').buildApiResponseTable(response);

					//Start background tasks.
					var period = heartbeat;
					heartbeat = window.setInterval(function(){Twoshoes.backgroundTask(period)}, period);
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
