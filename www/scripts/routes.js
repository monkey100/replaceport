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
					Twoshoes.helper('widgets').displayGlobalWidgets();
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
				path : 'projects',  //this regex needs to be precise match not general pattern fit.
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
			profile : {
				path : 'profile',
				dispatch : function()
				{
					var user = Twoshoes.get('user');
					var profile = {
						username : user.username,
						alias : user.alias,
						email : user.email
					}

					var display = Mustache.to_html(jQuery('#profile_page').html(), profile);
					jQuery('#main_pane').html(display);

					var projects = [];
					if (typeof user.projects != 'undefined')
					{
						jQuery.each(user.projects, function(index, project)
						{
							projects[index] = {
								user : user.username,
								key : project.key,
								title : project.title,
								permission : (project.owner == user.alias)? 'owner': 'contributor',
								version : Twoshoes.helper('project').getLastestProjectVersion(project, true)
							}
						});
					}

					if (Twoshoes.count(projects) > 0)
					{
						var projectsList = Mustache.to_html(jQuery('#projects_list').html(), {projects:projects});
						jQuery('#projects').html(projectsList);
					}

					var watchlists = [];
					if (typeof user.watchlists != 'undefined')
					{
						jQuery.each(user.watchlists, function(index, project)
						{
							watchlists[index] = {
								user : project.user,
								key : project.key,
								title : project.title,
								version : Twoshoes.helper('project').getLastestProjectVersion(project, true)
							}
						});
					}

					if (Twoshoes.count(watchlists) > 0)
					{
						var watchlistsList = Mustache.to_html(jQuery('#watchlists_list').html(), {projects:watchlists});
						jQuery('#watchlists').html(watchlistsList);
					}
				}
			},
			profileEdit : {
				path : 'profile/([^/]+)/edit/',
				dispatch : function()
				{
					//Edit profile.
					//check for permissions on save

					var user = Twoshoes.get('user');
					var profile = {
						username : user.username,
						email : user.email,
						alias : user.alias
					}

					var profileForm = Mustache.to_html(jQuery('#profile_panel').html(), profile);
					jQuery('#actn_pane').html(profileForm);
				}
			},
			profileAdd : {
				path : 'profile/([^/]+)/add/',
				dispatch : function()
				{
					var project = {};
					Twoshoes.helper('widgets').displayProjectEdit(project);
				}
			},
			profileUpdate : {
				path : 'profile/([^/]+)/update/',
				dispatch : function()
				{
					var name = Twoshoes.node(4);
					var user = Twoshoes.get('user');
					var project = {};
					if (typeof user.projects != 'undefined')
					{
						jQuery.each(user.projects, function(index, value)
						{
							if (value.key == name)
							{
								project = value;
							}
						});
					}

					Twoshoes.helper('widgets').displayProjectEdit(project);
				}
			},
			register : {
				path : 'register',
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#register_page').html());
					jQuery('#main_pane').html(display);
					jQuery('#register_username').focus();
				}
			},
			contact : {
				path : 'contact', //this regex needs to be precise match not general pattern fit.
				dispatch : function()
				{
					var display = Mustache.to_html(jQuery('#contact_page').html());
					jQuery('#main_pane').html(display);
					jQuery('#contact_name').focus();
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
					//Twoshoes.route('menus').invoke('registerReset');
					jQuery(target).addClass('focus');
					jQuery('#login_panel').slideDown();

					//Set global event listener for licks off this panel to close.
				}
			},
			loginReset : {
				event : 'click',
				target : 'a#login_reset',
				dispatch : function(target)
				{
					jQuery('#login_username').val('');
					jQuery('#login_password').val('');
					jQuery('#login_panel').slideUp();
					jQuery('a#login_menu').removeClass('focus');

					//Set global event listener for licks off this panel to close.
				}
			},
			loginSubmit : {
				event : 'click',
				target : '#login_submit',
				dispatch : function(target)
				{
					var form = jQuery(target).parentsUntil('form').parent();
					var apiData =
					{
						users : {
							login : {
								0 :
								{
									auth : jQuery(form).find('#login_username').val(),
									username : jQuery(form).find('#login_username').val(),
									password : jQuery(form).find('#login_password').val()
								}
							}
						}
					};
					var data = JSON.stringify(apiData);
					var config = {
						data : apiData,
						success : function(response)
						{
							if ((typeof response == 'undefined') || (!response))
							{
								//fail message
							}
							else
							{
								if (typeof response.users.login[0]['errors'] == 'undefined')
								{
									//Set path to user account and refesh for cookies.
									window.location.replace(domainUrl+'#profile/'+jQuery(form).find('#login_username').val());
									location.reload(true);
								}
								else
								{
									//display errors
								}
							}
						}
					};

					Twoshoes.request('app').transact(config);
				}
			},
			registerSubmit : {
				event : 'click',
				target : 'a#register_submit',
				dispatch : function(target)
				{
					var config = {};
					Twoshoes.request('app').transact(config);
				}
			},
			changeTabs : {
				event : 'click',
				target : 'a.changetab',
				handle : '.blur',
				dispatch : function(target)
				{
 					var id = jQuery(target).attr('id')
 					var name = id.replace('change_tabs_', '');
 					jQuery(target).parentsUntil('div.tabs').find('a.focus').removeClass('focus').addClass('blur');
 					jQuery(target).removeClass('blur').addClass('focus');
					jQuery.each(jQuery('#project_change > div'), function(key, element)
 					{
 						if (jQuery(element).hasClass(name))
 						{
 							jQuery(element).show();
 						}
 						else if (!jQuery(element).hasClass('tabs'))
 						{
 							jQuery(element).hide();
 						}
 					});
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