//helpers.js
//They way I want to organise the helper objects is into sub poperties of the property object.
//EG helpers : {php : {somefunction : function(){}}
//This doesn't need any deep functionality, that's what plugins are for.


Twoshoes.init(
{
	helpers : {
		project : {
			getProjectFileVersion : function(filename, key)
			{
				var version = [];
				var fileversion = filename.replace(key+'.', '');
				version = fileversion.split('.');

				return version;
			},
			buildGameVersion : function(changelog)
			{
				gameVersion = changelog.game_major;
				if (changelog.game_minor != null)
				{
					gameVersion = gameVersion+'.'+changelog.game_minor;
				}
				if (changelog.game_revision != null)
				{
					gameVersion = gameVersion+'.'+changelog.game_revision;
				}
				if (changelog.game_build != null)
				{
					gameVersion = gameVersion+'.'+changelog.game_build;
				}

				return gameVersion;
			},
			buildProjectVersion : function(changelog)
			{
				projectVersion = changelog.project_major;
				if (changelog.project_minor != null)
				{
					projectVersion = projectVersion+'.'+changelog.project_minor;
				}
				if (changelog.project_revision != null)
				{
					projectVersion = projectVersion+'.'+changelog.project_revision;
				}
				if (changelog.project_build != null)
				{
					projectVersion = projectVersion+'.'+changelog.project_build;
				}

				return projectVersion;
			},
			getGameVersion : function(release, changelogs)
			{
				var gameVersion = '0.1';
				var projectRelease = [];

				//Normalise release version.
				var versionNumbers = 4;
				for (var i = 0, j = versionNumbers; i < j; i++)
				{
					(function()
					{
						if (typeof release[i] == 'undefined')
						{
							projectRelease[i] = '0';
						}
						else
						{
							projectRelease[i] = release[i];
						}
					})(i);
				}

				//Normalise changlelog version.
				var normaliseProjectVersion = (function(changelog)
				{
					if (changelog.project_major == null)
					{
						changelog.project_major = '0';
					}
					if (changelog.project_minor == null)
					{
						changelog.project_minor = '0';
					}
					if (changelog.project_revision == null)
					{
						changelog.project_revision = '0';
					}
					if (changelog.project_build == null)
					{
						changelog.project_build = '0';
					}

					return changelog;
				});

				//Get matching game version
				jQuery.each(changelogs, function(key, changelog)
				{
					var normalisedChangelog = normaliseProjectVersion(changelog);

					if ((projectRelease[0] == normalisedChangelog.project_major)
					&& (projectRelease[1] == normalisedChangelog.project_minor)
					&& (projectRelease[2] == normalisedChangelog.project_revision)
					&& (projectRelease[3] == normalisedChangelog.project_build))
					{
						//Set game version values.
						gameVersion = Twoshoes.helper('project').buildGameVersion(changelog);
					}
				});

				return gameVersion;
			},
			getProjectFileSize : function(filesize)
			{
				return filesize;
			},
			getProjectFilesByType : function(project, type)
			{
				var files = []
				var count = 0;
				jQuery.each(project.files, function(key, data)
				{
					if (data.format == type && data.location == 'release/')
					{
						var release = Twoshoes.helper('project').getProjectFileVersion(data.name, project.key);
						var version = Twoshoes.helper('project').getGameVersion(release, project.changelogs);

						//Assemble file data row.
						files[count] = {
	                    	release : release.join('.'),
	                    	version : version,
	                    	date : Twoshoes.helper('time').formatDate('d M y'),
	                    	size : Twoshoes.helper('project').getProjectFileSize(data.size),
	                    	file : data.location+data.name+'.'+data.format
						}
						count++;
					}
				});

				return files;
			},
			getProjectTabsList : function(project)
			{
				var tabs = {
					description : true,
					changelog : false,
					comments : false
				};

				return tabs;
			},
			getProjectChangelogs : function(project)
			{
				var changelogs = [];
				jQuery.each(project.changelogs, function(index, data)
				{
					changelogs[index] = {
						'release': Twoshoes.helper('project').buildProjectVersion(data),
						'version': Twoshoes.helper('project').buildGameVersion(data),
						'user': data.user,
						'alias': data.alias,
						'date': Twoshoes.helper('time').formatDate('d M y', data.created),
						'comment': data.comment
					};
				});

				return changelogs;
			},
			getProjectComments : function(project)
			{
				var comments = [];
				jQuery.each(project.comments, function(index, data)
				{
					comments[index] = {
						'user': data.user,
						'alias': data.alias,
						'date': Twoshoes.helper('time').formatDate('d M y', data.date),
						'body': data.comment
					};
				});

				return comments;
			}
		}
	}

});
