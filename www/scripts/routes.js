//routes.js

//Need a routine to limit the amount of free trial that the user can signup for - 3months
Twoshoes.init(
{
	routes : {
		pages : {
			home : {
				path : '', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					Twoshoes.helper('widgets').displayIndexPage();
					Twoshoes.helper('widgets').displayCategoryMenu();
				}
			},
			search : {
				path : 'search', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					Twoshoes.helper('widgets').displaySearchPage();
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
		},
		menus : {
			bangMenu : {
				event : 'click',
				target : 'a.inert',
				behave : false
			},
			projectTabs : {
				event : 'click',
				target : 'a.tab',
				handle : '.blur',
				dispatch : function(target)
				{
 					var name = jQuery(target).html().toLowerCase();
 					jQuery(target).parentsUntil('div.tabs').find('a.focus').removeClass('focus').addClass('blur');
 					jQuery(target).removeClass('blur').addClass('focus');
					jQuery.each(jQuery('#tabs_pane div.main > div'), function(key, element)
 					{
 						if (jQuery(element).hasClass(name))
 						{
 							jQuery(element).show();
 						}
 						else
 						{
 							jQuery(element).hide();
 						}
 					});
				}
			},
			viewNotes : {
				event : 'click',
				target : 'a.changelog',
				dispatch : function(target)
				{
					if (jQuery(target).hasClass('blur'))
					{
						jQuery(target).removeClass('blur').removeClass('typcn-arrow-maximise').addClass('focus').addClass('typcn-arrow-minimise').parentsUntil('tr').parent().next().show();
					}
					else if (jQuery(target).hasClass('focus'))
					{
						jQuery(target).removeClass('focus').removeClass('typcn-arrow-minimise').addClass('blur').addClass('typcn-arrow-maximise').parentsUntil('tr').parent().next().hide();
					}
				}
			}
		}
	}
});