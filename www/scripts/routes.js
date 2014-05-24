//routes.js

//Need a routine to limit the amount of free trial that the user can signup for - 3months
Twoshoes.init(
{
	routes : {
		pages : {
			home : {
				path : '/*/', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					Twoshoes.helper('widgets').displayIndexPage();
				}
			},
			project : {
				path : 'projects/',  //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					//get project
					var projectKey = Twoshoes.node(2);
					var projectData = Twoshoes.get('projects'); //this could be problematic
					var project = {};
					jQuery.each(projectData, function(index, data)
					{
						if (data.key == projectKey)
						{
							project = data;
						}
					});

					Twoshoes.helper('widgets').displayProjectView(project);
				}
			}
		}
	}
});