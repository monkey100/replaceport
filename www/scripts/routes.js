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
			},
			contact : {
				path : 'contact', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#contact_page').html());
					jQuery('#main_pane').html(display);
				}
			},
			about : {
				path : 'about', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#about_page').html());
					jQuery('#main_pane').html(display);
				}
			},
			faq : {
				path : 'faq', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#faq_page').html());
					jQuery('#main_pane').html(display);
				}
			},
			privacy : {
				path : 'privacy', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#privacy_page').html());
					jQuery('#main_pane').html(display);
				}
			},
			terms : {
				path : 'terms', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#terms_page').html());
					jQuery('#main_pane').html(display);
				}
			},
			guidelines : {
				path : 'guidelines', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#guidelines_page').html());
					jQuery('#main_pane').html(display);
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
			},
			loginPanel : {
				event : 'click',
				target : 'a#login_menu',
				dispatch : function(target)
				{
					//Open up login panel
					jQuery('#login_pane').slideDown();
					//Need to attach a way to close the panel when the user cicks out of the login area.
					//This will be to attach an event on the document object anlook through all the
					//If the holder of event is not within the document stack then the window should close.
				}
			},
			registerPanel : {
				event : 'click',
				target : 'a#register_menu',
				dispatch : function(target)
				{
					//Open up login panel
					jQuery('#login_pane').slideDown();
					//Need to attach a way to close the panel when the user cicks out of the login area.
					//This will be to attach an event on the document object anlook through all the
					//If the holder of event is not within the document stack then the window should close.
				}
			}
		},
		actions : {
			contactSubmit : {
				event : 'click',
				target : '#contact_submit',
				dispatch : function(target)
				{
					//Check for errors.

					//Makea request for contact.
					var form = jQuery(target).parentsUntil('form').parent();
					var request = {
						data : {
							name : jQuery('#contact_name').val(),
							email : jQuery('#contact_email').val(),
							body : jQuery('#contact_body').val()
						},
						success : function(response)
						{
							if (Twoshoes.count(response.error) > 0)
							{
								var errors = '';
								jQuery.each(response.error, function(index, value)
								{
									errors += value+'<br />';
								});

								jQuery('#contact_errors').html(errors);
							}
							else
							{
								var values = {name:response.name, email:response.email, body:response.body};
								var display = Mustache.to_html(jQuery('#contact_confirm').html(), values);
								jQuery('#cont_pane').html(display);
							}
						},
						error : function()
						{
							var values = {msg:'fail'};
							var display = Mustache.to_html(jQuery('#contact_confirm').html(), values);
							jQuery('#cont_pane').html(display);
						}
					};

					Twoshoes.request('app').contact(request);
				}
			}
		}
	}
});