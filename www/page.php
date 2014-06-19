<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<title><?php print $lang['Meta_Title']; ?></title>

<!-- Meta tags -->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="keywords" content="<?php print $lang['Meta_Keywords']; ?>" />
	<meta name="description" content="<?php print $lang['Meta_Description']; ?>" />
	<meta name="copyright" content="<?php print $lang['Meta_Copyright']; ?>" />
	<meta name="author" content="" />
	<meta name="rating" content="general" />
	<meta name="robots" content="all" />

<!-- Favicon -->
	<link rel="shortcut icon" href="<?php print $theme['images']; ?>favicon.ico" />

<!-- Stylesheet -->
	<link rel="stylesheet" href="<?php print $theme['styles']; ?>settings.css" type="text/css" media="screen, projection">
	<link rel="stylesheet" href="<?php print $theme['styles']; ?>layout.css" type="text/css" media="screen, projection">
	<link rel="stylesheet" href="<?php print $theme['styles']; ?>typicons.min.css" type="text/css" media="screen, projection">

<!-- Javascript -->
	<script src="<?php print $theme['scripts']; ?>libraries/jquery-1.8.3.min.js" type="text/javascript"></script>
	<script src="<?php print $theme['scripts']; ?>libraries/mustache.js" type="text/javascript"></script>
	<script src="<?php print $theme['scripts']; ?>libraries/twoshoes.js" type="text/javascript"></script>
	<script src="<?php print $theme['scripts']; ?>bootstrap.js" type="text/javascript"></script>

</head>
<body>

<script id="catalog_item_brief" type="text/template">
					<div class="catalog_item_brief project_{{key}}">
<hr />
							<h4><a href="<?php print $theme['projects']; ?>#projects/{{key}}" title="Details">{{title}} <span class="version">(v{{version}})</span></a></h4>
<span class="downloads"><span>{{totaldownloads}}</span><a class="typcn typcn-download-outline action" title="Download"></a></span>
<img src="<?php print $theme['uploads']; ?>{{key}}/{{thumbnail}}" class="shadow" alt="" width="64" height="64" />
						<div class="meta_data">
<span class="author"><a class="typcn typcn-user-outline invite" title="Author"></a><span>{{owner}}</span></span>
<span class="report"><a class="typcn typcn-flag-outline warn" title="Report"></a></span>
						</div>
						<div class="data_actions">
							<ul>
<li><a class="typcn typcn-bookmark action" title="Watch"></a><span>{{followers}}</span></li>
<li><a class="typcn typcn-star-outline action" title="Rate"></a><span>{{rating}}</span></li>
							</ul>
						</div>
<span class="summary">{{summary}}</span>
					</div>
</script>

<script id="catalog_item" type="text/template">
					<div class="catalog_item project_{{key}}">
<hr />
							<h4><a href="<?php print $theme['projects']; ?>#projects/{{key}}" title="Details">{{title}} <span class="version">(v{{version}})</span></a></h4>
<span class="downloads"><span>{{totaldownloads}}</span><a class="typcn typcn-download-outline action" title="Download"></a></span>
<img src="<?php print $theme['uploads']; ?>{{key}}/{{thumbnail}}" class="shadow" alt="" width="192" height="192" />
						<div class="meta_data">
<span class="author"><a class="typcn typcn-user-outline invite" title="Author"></a><span>{{owner}}</span></span>
<span class="report"><a class="typcn typcn-flag-outline warn" title="Report"></a></span>
						</div>
						<div class="data_actions">
							<ul>
<li><a class="typcn typcn-bookmark action" title="Watch"></a><span>{{followers}}</span></li>
<li><a class="typcn typcn-star-outline action" title="Rate"></a><span>{{rating}}</span></li>
							</ul>
						</div>
<span class="summary">{{summary}}</span>
					</div>
<br class="drop-b" />
</script>

<script id="index_page" type="text/template">
			<div id="box1_scrn">
				<div id="box1_pane">
					<h3><?php print $lang['MostPopular']; ?></h3>
						<div id="mostpopular">
<!-- #catalog_item_brief -->
						</div>
				</div>
			</div>

			<div id="box2_scrn">
				<div id="box2_pane">
					<h3><?php print $lang['TopRated']; ?></h3>
						<div id="toprated">
<!-- #catalog_item_brief -->
						</div>
				</div>
			</div>

			<div id="box3_scrn">
				<div id="box3_pane">
					<h3><?php print $lang['LatestReleases']; ?></h3>
						<div id="latestreleases">
<!-- #catalog_item_brief -->
						</div>
				</div>
			</div>

			<div id="help_scrn">
				<div id="help_pane">
					<h3><?php print $lang['WhatIsReplaceport']; ?></h3>
<img src="images/about.jpg" class="shadow" alt="KSP Rocket Launch" width="216" height="144" />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</div>
			</div>
</script>

<script id="search_filters" type="text/template">
<span>Sort:</span>
							<ul>
<li><a class="typcn typcn-download-outline control" title="Downloads"></a></li>
<li><a class="typcn typcn-star-outline control" title="Rating"></a></li>
<li><a class="typcn typcn-bookmark control" title="Followers"></a></li>
							</ul>
</script>

<script id="search_paginagtion" type="text/template">
							<ol>
<li><b>First</b></li>
<li><b>&lt;</b></li>
<li><b>1</b></li>
<li><a href="" id="" class="" title="">2</a></li>
<li><a href="" id="" class="" title="">3</a></li>
<li><a href="" id="" class="" title="">4</a></li>
<li><a href="" id="" class="" title="">5</a></li>
<li><a href="" id="" class="" title="">&gt;</a></li>
							</ol>
</script>

<script id="search_page" type="text/template">
			<div id="advn_scrn">
				<div id="advn_pane">
					<h3><?php print $lang['AdvancedSearch']; ?></h3>
					<form name="" id="" class="" method="" action="">
<!-- 						<fieldset class="primary">
							<ul>
<li><label for=""></label><input type="text" name="" id="" class="" value="Keywords..." placeholder=""><em title="" class="error"></em></li>
							</ul>
						</fieldset> -->
						<fieldset class="refine">
							<ul>
<li><label for="">Min Rating</label><input type="range" name="" id="" class="" value="" min="0" max="5"><em title="" class="error"></em></li>
<li><label for="">Min Downloads</label><select name="" id="">
	<option value="1">0</option>
	<option value="2">50</option>
	<option value="2">500</option>
	<option value="2">5000</option>
</select><em title="" class="error"></em></li>
							</ul>
						</fieldset>
						<fieldset class="narrow">
							<ul>
<li><select name="" id="">
	<option value="1">category1</option>
	<option value="2">category2</option>
</select><em title="" class="error"></em>
<ul class="selected">
<li>category1</li>
<li>category2</li>
</ul>
</li>
<li><select name="" id="">
	<option value="1">tag1</option>
	<option value="2">tag2</option>
</select><em title="" class="error"></em>
<ul class="selected">
<li>tag1</li>
<li>tag2</li>
</ul>

</li>
							</ul>
						</fieldset>
						<fieldset class="action">
							<ul>
<li><input type="submit" name="" id="" class="" value="Search"></li>
							</ul>
						</fieldset>
					</form>

				</div>
			</div>

			<div id="rslt_scrn">
				<div id="rslt_pane">

					<div id="filt_scrn">
						<div id="filt_pane">
<!-- #search_filters -->
						</div>
					</div>
					<div id="tpag_scrn">
						<div id="tpag_pane">
<!-- #search_paginagtion -->
						</div>
					</div>
					<div id="item_scrn">
						<div id="item_pane">
							<h3><?php print $lang['SearchResults']; ?></h3>
							<div id="search_results">
<!-- #catalog_item -->
							</div>
						</div>
					</div>
					<div id="bpag_scrn">
						<div id="bpag_pane">
<!-- #search_paginagtion -->
						</div>
					</div>

				</div>
			</div>
</script>

<script id="project_tabs" type="text/template">
						<ul>
<li><a href="" class="inert tab focus" title=""><?php print $lang['Description']; ?></a></li>
<li><a href="" class="inert tab blur" title=""><?php print $lang['Changelog']; ?></a></li>
<li><a href="" class="inert tab blur" title=""><?php print $lang['Comments']; ?></a></li>
						</ul>
</script>

<script id="project_files" type="text/template">
					<h3><?php print $lang['ReleaseFiles']; ?></h3>
						<table id="">
							<thead>
								<tr>
<th><?php print $lang['Release']; ?></th>
<th><?php print $lang['Date']; ?></th>
<th><?php print $lang['KSP']; ?></th>
<th><?php print $lang['Size']; ?></th>
								</tr>
							</thead>
							<tbody>
{{#files}}
								<tr>
<td class="release"><a href="<?php print $theme['uploads']; ?>{{file}}" class="typcn typcn-download-outline action" title="Download"></a>{{release}}</td>
<td>{{date}}</td>
<td>{{version}}</td>
<td>{{size}} KB</td>
								</tr>
{{/files}}
							</tbody>
						</table>
</script>

<script id="project_changelog" type="text/template">
<table id="" class="">
	<thead>
		<tr>
<th>Release </th>
<th>Date</th>
<th>KSP</th>
<th>User</th>
<th>Notes</th>
		</tr>
	</thead>
	<tbody>
{{#changes}}
		<tr>
<td>{{release}}</td>
<td>{{date}}</td>
<td>{{version}}</td>
<td><a href="<?php print $theme['root']; ?>users/{{user}}" title="<?php print $lang['View_Profile']; ?>" class="text">{{alias}}</a></td>
<td class="icon"><a class="typcn typcn-arrow-maximise action changelog blur" title="View Notes"></a></td>
		</tr>
		<tr style="display:none;">
<td colspan="5" class="comment">{{comment}}</td>
		</tr>
{{/changes}}
	</tbody>
</table>
</script>

<script id="project_contributors" type="text/template">
<table id="" class="">
	<thead>
		<tr>
<th>User</th>
<th>Status</th>
<th>Date</th>
<th class="icon"></th>
		</tr>
	</thead>
	<tbody>
{{#contributors}}
		<tr>
<td><a class="typcn typcn-edit edit action" title="Edit"></a> <a href="<?php print $theme['root']; ?>users/{{user}}" title="<?php print $lang['View_Profile']; ?>" class="text">{{alias}}</a></td>
<td>{{status}}</td>
<td>{{created}}</td>
<td class="icon"><a class="typcn typcn-backspace warn delete" title="Remove"></a></td>
		</tr>
{{/contributors}}
	</tbody>
</table>
</script>


<script id="project_comments" type="text/template">
{{#remarks}}
<div>
<div class="name"><a href="<?php print $theme['root']; ?>users/{{user}}" title="<?php print $lang['View_Profile']; ?>">{{alias}}</a></div>
<div class="date">{{date}}</div>
<div class="body">{{body}}</div>
</div>
<hr />
{{/remarks}}
						</ul>
</script>

<script id="project_description" type="text/template">
			<div id="info_scrn">
				<div id="info_pane">
					<h3><?php print $lang['ProjectInfo']; ?></h3>
					<div id="item_brief">
<!-- #catalog_item_brief -->
					</div>
				</div>
			</div>

			<div id="dwnl_scrn">
				<div id="dwnl_pane">
<span class="downloads"><a class="typcn typcn-download-outline action" title="Download Latest"></a></span>
				</div>
			</div>


			<div id="tabs_scrn">
				<div id="tabs_pane">
					<div class="tabs span-6 push-0 pull-0 ">
<!-- #project_tabs -->
					</div>
					<div class="main">
						<div class="description">
<img src="<?php print $theme['uploads']; ?>{{key}}/{{image}}" class="project_full shadow" alt="" width="256" height="256" />
{{description}}
						</div>
						<div class="changelog" style="display:none;">
<!-- #project_changelog -->
						</div>
						<div class="comments" style="display:none;">
<!-- #project_comments -->
						</div>
					</div>

				</div>
			</div>

			<div id="file_scrn">
				<div id="file_pane">
<!-- #project_files -->
				</div>
			</div>
</script>

<script id="project_changelog_page" type="text/template">
			<div id="info_scrn">
				<div id="info_pane">
					<h3><?php print $lang['ProjectInfo']; ?></h3>
<!-- #catalog_item_brief -->
				</div>
			</div>

			<div id="dwnl_scrn">
				<div id="dwnl_pane">
<span class="downloads"><span>{{totaldownloads}}</span><a class="typcn typcn-download-outline action" title="Download"></a></span>
				</div>
			</div>


			<div id="tabs_scrn">
				<div id="tabs_pane">
					<div class="tabs span-6 push-0 pull-0 ">
						<ul>
<li><a href="" id="" class="" title=""><?php print $lang['Description']; ?></a></li>
<li><a href="" id="" class="" title=""><?php print $lang['Changelog']; ?></a></li>
<li><a href="" id="" class="" title=""><?php print $lang['Comments']; ?></a></li>
						</ul>
					</div>

					<div class="change">
						<div class="info">
<span class="name">Username</span><span class="date">date string</span><span class="version">Version 1.0</span>
						</div>
						<div class="body">
<p><ul>
<li>Lorem ipsum dolor sit amet</li>
<li>consectetur adipisicing elit</li>
<li>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
<li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</li>
<li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</li>
<li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</li>
</ul></p>
						</div>
					</div>

					<div class="change">
						<div class="info">
<span class="name">Username</span><span class="date">date string</span><span class="version">Version 1.0</span>
						</div>
						<div class="body">
<p><ul>
<li>Lorem ipsum dolor sit amet</li>
<li>consectetur adipisicing elit</li>
<li>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
<li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</li>
<li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</li>
<li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</li>
</ul></p>
						</div>
					</div>

				</div>
			</div>

			<div id="file_scrn">
				<div id="file_pane">
					<h3><?php print $lang['ReleaseFiles']; ?></h3>
						<table id="">
							<thead>
								<tr>
<td><?php print $lang['Version']; ?></td>
<td><?php print $lang['Upload']; ?></td>
<td colspan="2"><?php print $lang['Size']; ?></td>
								</tr>
							</thead>
							<tbody>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
<td><form name="" id="" class="" method="" action="">
	<fieldset>
	<legend></legend>
		<ul>
<li><input type="button" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
		</ul>
	</fieldset>
</form></td>
								</tr>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
<td><form name="" id="" class="" method="" action="">
	<fieldset>
	<legend></legend>
		<ul>
<li><input type="button" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
		</ul>
	</fieldset>
</form></td>
								</tr>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
<td><form name="" id="" class="" method="" action="">
	<fieldset>
	<legend></legend>
		<ul>
<li><input type="button" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
		</ul>
	</fieldset>
</form></td>
								</tr>
							</tbody>
						</table>
				</div>
			</div>
</script>

<script id="project_comments_page" type="text/template">
			<div id="info_scrn">
				<div id="info_pane">
					<h3><?php print $lang['ProjectInfo']; ?></h3>
<!-- #catalog_item_brief -->
				</div>
			</div>

			<div id="dwnl_scrn">
				<div id="dwnl_pane">
					<form name="" id="" class="" method="" action="">
						<fieldset>
							<ul>
<li><input type="text" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
							</ul>
						</fieldset>
					</form>
				</div>
			</div>


			<div id="tabs_scrn">
				<div id="tabs_pane">
					<div class="tabs span-6 push-0 pull-0 ">
						<ul>
<li><a href="" id="" class="" title=""><?php print $lang['Description']; ?></a></li>
<li><a href="" id="" class="" title=""><?php print $lang['Changelog']; ?></a></li>
<li><a href="" id="" class="" title=""><?php print $lang['Comments']; ?></a></li>
						</ul>
					</div>

<span class="subinfo">101 Comments</span>
					<div class="comment">
						<div class="info">
<span class="name">Username</span><span class="date">date string</span>
						</div>
						<div class="body">
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						</div>
					</div>

					<div class="comment">
						<div class="info">
<span class="name">Username</span><span class="date">date string</span>
						</div>
						<div class="body">
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						</div>
					</div>

					<div class="reply">
<span><?php print $lang['log_in_to_comment']; ?></span>
					</div>

				</div>
			</div>

			<div id="file_scrn">
				<div id="file_pane">
					<h3><?php print $lang['ReleaseFiles']; ?></h3>
						<table id="">
							<thead>
								<tr>
<td><?php print $lang['Version']; ?></td>
<td><?php print $lang['Upload']; ?></td>
<td colspan="2"><?php print $lang['Size']; ?></td>
								</tr>
							</thead>
							<tbody>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
<td><form name="" id="" class="" method="" action="">
	<fieldset>
	<legend></legend>
		<ul>
<li><input type="button" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
		</ul>
	</fieldset>
</form></td>
								</tr>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
<td><form name="" id="" class="" method="" action="">
	<fieldset>
	<legend></legend>
		<ul>
<li><input type="button" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
		</ul>
	</fieldset>
</form></td>
								</tr>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
<td><form name="" id="" class="" method="" action="">
	<fieldset>
	<legend></legend>
		<ul>
<li><input type="button" name="" id="" class="" value="Download"><em title="" class="error"></em></li>
		</ul>
	</fieldset>
</form></td>
								</tr>
							</tbody>
						</table>
				</div>
			</div>
</script>

<script id="watchlists_list" type="text/template">
					<table class="watchlist">
						<tbody>
{{#projects}}
							<tr>
<td width="27px"><span class="typcn typcn-user-outline owner"></span></td>
<td><a href="#projects/{{key}}" id="" class="typcn typcn-export-outline action" title="<?php print $lang['View']; ?>"></a> {{version}}</td>
<th>{{title}}</th>
<th width="27px"><a href="" id="" class="typcn typcn-backspace warn delete" title="<?php print $lang['Delete']; ?>"></a></th>
							</tr>
{{/projects}}
						</tbody>
					</table>
</script>

<script id="projects_list" type="text/template">
					<table class="projects">
						<tbody>
{{#projects}}
							<tr>
<td width="27px"><span class="typcn typcn-user-outline {{permission}}"></span></td>
<td><a href="#projects/{{key}}" id="" class="typcn typcn-export-outline action" title="<?php print $lang['View']; ?>"></a> {{version}}</td>
<th>{{title}}</th>
<th width="27px"><a href="#profile/{{user}}/update/{{key}}" id="" class="typcn typcn-edit action edit" title="<?php print $lang['Edit']; ?>"></a></th>
							</tr>
{{/projects}}
						</tbody>
					</table>
</script>

<script id="change_tabs" type="text/template">
					<ul>
<li><a href="" id="change_tabs_description" class="typcn typcn-business-card inert action changetab focus" title=""></a></li>
<li><a href="" id="change_tabs_uploads" class="typcn typcn-upload-outline inert action changetab blur" title=""></a></li>
<li><a href="" id="change_tabs_contributors" class="typcn typcn-group-outline inert action changetab blur" title=""></a></li>
					</ul>
</script>

<script id="change_description" type="text/template">
					<form name="change_description" id="change_description_form" class="wideform-6" method="POST" action="">
						<fieldset class="input">
							<ul>
<li class="short"><label for="change_description_title"><?php print $lang['Title']; ?></label><input type="text" name="change_description_title" id="change_description_title" class="long" value="{{title}}" placeholder="<?php print $lang['Title']; ?>"><em title="" class="error"></em></li>
<li class="long"><label for="change_description_summary"><?php print $lang['Summary']; ?></label><textarea name="change_description_summary" id="change_description_summary" class="short" placeholder="<?php print $lang['Summary']; ?>">{{summary}}</textarea><em title="" class="error"></em></li>
<li class="vlong"><label for="change_description_description"><?php print $lang['Description']; ?></label><textarea name="change_description_description" id="change_description_description" class="long" placeholder="<?php print $lang['Description']; ?>">{{description}}</textarea><em title="" class="error"></em></li>
							</ul>
						</fieldset>
						<fieldset class="action">
							<ul>
<li class="short"><a href="#" id="change_description_submit" class="typcn typcn-cross action inert" title="<?php print $lang['Save']; ?>"></a><span class="error" id="change_errors"></span></li>
							</ul>
						</fieldset>
					</form>
</script>

<script id="change_uploads" type="text/template">
<div class="list"></div>
					<form name="change_uploads" id="change_uploads_form" class="wideform-6" method="POST" action="">
						<fieldset class="input">
							<ul>
<li class="short"><label for="change_uploads_release"><?php print $lang['Release']; ?></label><input type="text" name="change_uploads_release" id="change_uploads_release" class="long" value="{{release}}" placeholder="<?php print $lang['Release']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="change_uploads_date"><?php print $lang['Date']; ?></label><input type="text" name="change_uploads_date" id="change_uploads_date" class="long" value="{{date}}" placeholder="<?php print $lang['Date']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="change_uploads_game"><?php print $lang['Game']; ?></label><input type="text" name="change_uploads_game" id="change_uploads_game" class="long" value="{{game}}" placeholder="<?php print $lang['Game']; ?>"><em title="" class="error"></em></li>
<li class="vlong"><label for="change_uploads_notes"><?php print $lang['Notes']; ?></label><textarea name="change_uploads_notes" id="change_uploads_notes" class="long" placeholder="<?php print $lang['Notes']; ?>">{{notes}}</textarea><em title="" class="error"></em></li>
							</ul>
						</fieldset>
						<fieldset class="action">
							<ul>
<li class="short"><a href="#" id="change_uploads_submit" class="typcn typcn-cross action inert" title="<?php print $lang['Save']; ?>"></a><span class="error" id="change_errors"></span></li>
							</ul>
						</fieldset>
					</form>
</script>

<script id="change_contributors" type="text/template">
<div class="list"></div>
					<form name="change_contributors" id="change_contributors_form" class="wideform-6" method="POST" action="">
						<fieldset class="input">
							<ul>
<li class="short"><label for="change_contributors_"><?php print $lang['User']; ?></label><input type="text" name="change_contributors_" id="change_contributors_" class="long" value="{{User}}" placeholder="<?php print $lang['User']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="change_contributors_"><?php print $lang['Status']; ?></label><input type="text" name="change_contributors_" id="change_contributors_" class="long" value="{{status}}" placeholder="<?php print $lang['Status']; ?>"><em title="" class="error"></em></li>
							</ul>
						</fieldset>
						<fieldset class="action">
							<ul>
<li class="short"><a href="#" id="change_contributors_submit" class="typcn typcn-cross action inert" title="<?php print $lang['Save']; ?>"></a><span class="error" id="change_errors"></span></li>
							</ul>
						</fieldset>
					</form>
</script>

<script id="change_title_add" type="text/template">
<?php print $lang['Add_Project']; ?>
</script>

<script id="change_title_update" type="text/template">
<?php print $lang['Update_Project']; ?>
</script>

<script id="change_panel" type="text/template">
					<h3 class="hang-2"><!-- #change_title_add/change_title_update --></h3>
					<div id="project_change">
						<div class="tabs">
	<!-- #change_tabs -->
						</div>
						<div class="description">
	<!-- #change_description -->
						</div>
						<div class="uploads" style="display:none;">
	<!-- #change_uploads -->
						</div>
						<div class="contributors" style="display:none;">
	<!-- #change_contributors -->
						</div>
					</div>
<br class="drop-b" />
</script>

<script id="profile_panel" type="text/template">
					<h3 class="hang-2"><?php print $lang['Edit_Profile']; ?></h3>
					<form name="profile" id="register_form" class="wideform-6" method="POST" action="">
						<fieldset class="input">
							<ul>
<li class="short"><label for="profile_username">Username</label><input type="text" name="profile_username" id="profile_username" class="long" value="{{username}}" placeholder="<?php print $lang['Username']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="profile_alias">Alias</label><input type="text" name="profile_alias" id="profile_alias" class="long" value="{{alias}}" placeholder="<?php print $lang['Alias']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="profile_password">Password</label><input type="password" name="profile_password" id="profile_password" class="long" value="" placeholder="<?php print $lang['Password']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="profile_email">Email</label><input type="email" name="profile_email" id="profile_email" class="long" value="{{email}}" placeholder="<?php print $lang['Email']; ?>"><em title="" class="error"></em></li>
							</ul>
						</fieldset>
						<fieldset class="action">
							<ul>
<li class="short"><a href="#" id="profile_submit" class="typcn typcn-cross action inert" title="<?php print $lang['Save']; ?>"></a><span class="error" id="profile_errors"></span></li>
							</ul>
						</fieldset>
					</form>
<br class="drop-b" />
</script>

<script id="profile_page" type="text/template">
			<div id="user_scrn">
				<div id="user_pane">
					<h3><?php print $lang['UserInfo']; ?></h3>
					<div class="control text-r pane-h">
<a href="#profile/{{username}}/edit/" id="" class="typcn typcn-edit action edit" title="<?php print $lang['Edit']; ?>"></a>
					</div>
					<table class="profile">
						<tbody>
							<tr>
<th><?php print $lang['Username']; ?>:</th>
<td>{{username}}</td>
							</tr>
							<tr>
<th><?php print $lang['Alias']; ?>:</th>
<td>{{alias}}</td>
							</tr>
							<tr>
<th><?php print $lang['Email']; ?>:</th>
<td>{{email}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div id="actn_scrn">
				<div id="actn_pane">
<!-- #profile_panel -->
<!-- #change_panel -->
<!-- #change_tabs -->
				</div>
			</div>

			<div id="proj_scrn">
				<div id="proj_pane">
					<h3><?php print $lang['Projects']; ?></h3>
					<div class="control text-r pane-h">
<a href="#profile/{{username}}/add/" id="" class="typcn typcn-folder-add action" title="<?php print $lang['New']; ?>"></a>
					</div>
					<div id="projects">
<!-- #projects_list -->
					</div>
				</div>
			</div>

			<div id="wtch_scrn">
				<div id="wtch_pane">
					<h3><?php print $lang['Watchlist']; ?></h3>
					<div id="watchlists">
<!-- #watchlists_list -->
<?php print $lang['Empty']; ?>
					</div>
				</div>
			</div>
</script>

<script id="profile_project_page" type="text/template">
			<div id="user_scrn">
				<div id="user_pane">
					<h3><?php print $lang['UserInfo']; ?></h3>
						<table class="profile">
							<tbody>
								<tr>
<th><?php print $lang['Username']; ?>:</th>
<td>usernaem</td>
								</tr>
								<tr>
<th><?php print $lang['Email']; ?>;</th>
<td>emailaddress</td>
								</tr>
							</tbody>
						</table>
				</div>
			</div>


			<div id="actn_scrn">
				<div id="actn_pane">
					<h3><?php print $lang['Actions']; ?></h3>

				</div>
			</div>

			<div id="proj_scrn">
				<div id="proj_pane">
					<h3><?php print $lang['Projects']; ?></h3>
					<table class="projects">
						<tbody>
							<tr>
<th>Project title</th>
<td>version</td>
<td>modified</td>
							</tr>
							<tr>
<th>Project title</th>
<td>version</td>
<td>modified</td>
							</tr>
							<tr>
<th>Project title</th>
<td>version</td>
<td>modified</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div id="wtch_scrn">
				<div id="wtch_pane">
					<h3><?php print $lang['Watchlist']; ?></h3>
					<table class="watchlist">
						<tbody>
							<tr>
<th>Project name</th>
<td>version</td>
<td>modified</td>
							</tr>
							<tr>
<th>Project name</th>
<td>version</td>
<td>modified</td>
							</tr>
							<tr>
<th>Project name</th>
<td>version</td>
<td>modified</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
</script>

<script id="admin_page" type="text/template">
			<div id="user_scrn">
				<div id="user_pane">
					<h3><?php print $lang['UserInfo']; ?></h3>
					<table class="profile">
						<tbody>
							<tr>
<th><?php print $lang['Username']; ?>:</th>
<td>usernaem</td>
							</tr>
							<tr>
<th><?php print $lang['Email']; ?>;</th>
<td>emailaddress</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div id="actn_scrn">
				<div id="actn_pane">

					<div class="catalog_item_brief screen-l span-3 push-0">
							<h3>Project Title</h3>
<span class="version">v1.0</span>
<img src="<?php print $theme['images']; ?>logo.png" class="" alt="" width="64" height="64" />
						<div class="meta_data">
<span class="author">Author Name</span>
<span class="rating">* * * * *</span>
<span class="downloads">10 000</span>
						</div>
						<div class="data_actions">
							<form name="" id="" class="" method="" action="">
								<fieldset>
								<legend></legend>
									<ul>
<li><input type="button" name="" id="" class="" value="Update" placeholder=""><em title="" class="error"></em></li>
									</ul>
								</fieldset>
							</form>
						</div>
<span class="summary">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</span>
					</div>

					<div class="versions screen-l span-3 pull-0">
						<table id="">
							<thead>
								<tr>
<td>Version</td>
<td>Upload</td>
<td colspan="2">Size</td>
								</tr>
							</thead>
							<tbody>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
								</tr>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
								</tr>
								<tr>
<td>v1.0</td>
<td>05/09/2014</td>
<td>250kb</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="tabs span-6 push-0 pull-0 ">
						<ul>
<li><a href="" id="" class="" title="">Description</a></li>
<li><a href="" id="" class="" title="">Changelog</a></li>
<li><a href="" id="" class="" title="">Comments</a></li>
						</ul>
					</div>
					<div class="main">
<img src="<?php print $theme['images']; ?>logo.png" class="project_full" alt="" width="256" height="256" />
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
					</div>
				</div>
			</div>

			<div id="rprt_scrn">
				<div id="rprt_pane">
					<h3>Reports</h3>
					<ul>
<li><table class="reports">
	<tbody>
		<tr>
<th>Project title</th>
<td>Reporter</td>
<td>view</td>
		</tr>
		<tr>
<td>status</td>
<td>created</td>
<td>display</td>
		</tr>
		<tr>
<td colspan="2">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</td>
<td>edit</td>
		</tr>
		<tr>
<td colspan="2">
	<form name="" id="" class="" method="" action="">
		<fieldset>
		<legend></legend>
			<ul>
<li><textarea name="" class="" id="" value="" placeholder="Outcome"></textarea><em title="" class="error"></em></li>
<li><input type="submit" name="" id="" class="" value="Hold" placeholder=""><em title="" class="error"></em></li>
<li><input type="submit" name="" id="" class="" value="Dismiss" placeholder=""><em title="" class="error"></em></li>
			</ul>
		</fieldset>
	</form>
</td>
		</tr>
	</tbody>
</table></li>

<li><table class="reports">
	<tbody>
		<tr>
<th>Project title</th>
<td>Reporter</td>
<td>view</td>
		</tr>
		<tr class="hide">
<td>status</td>
<td>created</td>
<td>display</td>
		</tr>
		<tr class="hide">
<td colspan="2">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</td>
<td>edit</td>
		</tr>
		<tr class="hide">
<td colspan="2">
	<form name="" id="" class="" method="" action="">
		<fieldset>
		<legend></legend>
			<ul>
<li><textarea name="" class="" id="" value="" placeholder="Outcome"></textarea><em title="" class="error"></em></li>
<li><input type="submit" name="" id="" class="" value="Hold" placeholder=""><em title="" class="error"></em></li>
<li><input type="submit" name="" id="" class="" value="Dismiss" placeholder=""><em title="" class="error"></em></li>
			</ul>
		</fieldset>
	</form>
</td>
		</tr>
	</tbody>
</table></li>

<li><table class="reports">
	<tbody>
		<tr>
<th>Project title</th>
<td>Reporter</td>
<td>view</td>
		</tr>
		<tr class="hide">
<td>status</td>
<td>created</td>
<td>display</td>
		</tr>
		<tr class="hide">
<td colspan="2">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</td>
<td>edit</td>
		</tr>
		<tr class="hide">
<td colspan="2">
	<form name="" id="" class="" method="" action="">
		<fieldset>
		<legend></legend>
			<ul>
<li><textarea name="" class="" id="" value="" placeholder="Outcome"></textarea><em title="" class="error"></em></li>
<li><input type="submit" name="" id="" class="" value="Hold" placeholder=""><em title="" class="error"></em></li>
<li><input type="submit" name="" id="" class="" value="Dismiss" placeholder=""><em title="" class="error"></em></li>
			</ul>
		</fieldset>
	</form>
</td>
		</tr>
	</tbody>
</table></li>
     				</ul>
				</div>
			</div>
</script>

<script id="category_menu_item" type="text/template">
<li><a href="<?php print $theme['root']; ?>{{key}}" class="category" title="{{title}}">{{brief}}</a>{{& children}}</li>
</script>

<script id="contact_confirm" type="text/template">
<h3>Contact Messaege Sent</h3>
	<dl>
<dt>Name</dt><dd>{{name}}</dd>
<dt>Email</dt><dd>{{email}}</dd>
<dt>Messege</dt><dd>{{body}}</dd>
	</dl>
</script>

<script id="contact_page" type="text/template">
			<div id="cont_scrn">
				<div id="cont_pane">
					<h3>Contact Us</h3>
<form name="contact" id="contact_form" class="wideform-6" method="POST" action="<?php print $theme['root']; ?>/contact/">
	<fieldset>
		<ul>
<li class="short"><label for="contact_name">Name</label><input type="text" name="contact_name" id="contact_name" class="long" value="" placeholder="Name"><em title="contact_name" class="error"></em></li>
<li class="short"><label for="contact_email">Email</label><input type="text" name="contact_email" id="contact_email" class="long" value="" placeholder="Email"><em title="contact_email" class="error"></em></li>
<li class="long"><label for="contact_body">Message</label><textarea name="contact_body" class="short" id="contact_body" value="" placeholder="Message"></textarea><em title="contact_body" class="error"></em></li>
		</ul>
	</fieldset>
	<fieldset>
		<ul>
<li class="short"><a href="#" class="typcn typcn-mail action inert" id="contact_submit" title="Send Message"></a><span class="error" id="contact_errors"></span></li>
		</ul>
	</fieldset>
</form>
<br class="drop-b" />
				</div>
			</div>
			<div id="comm_scrn">
				<div id="comm_pane">
<h3>Community links</h3>
<p>additional info to getting in touch with modders, etc.</p>
				</div>
			</div>
</script>


<script id="register_page" type="text/template">
			<div id="cont_scrn">
				<div id="cont_pane">
					<h3>Register as User</h3>
					<form name="register" id="register_form" class="wideform-6" method="POST" action="">
						<fieldset class="input">
							<ul>
<li class="short"><label for="register_username">Username</label><input type="text" name="register_username" id="register_username" class="long" value="" placeholder="<?php print $lang['Username']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="register_alias">Alias</label><input type="text" name="register_alias" id="register_alias" class="long" value="" placeholder="<?php print $lang['Alias']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="register_password">Password</label><input type="password" name="register_password" id="register_password" class="long" value="" placeholder="<?php print $lang['Password']; ?>"><em title="" class="error"></em></li>
<li class="short"><label for="register_email">Email</label><input type="email" name="register_email" id="register_email" class="long" value="" placeholder="<?php print $lang['Email']; ?>"><em title="" class="error"></em></li>
							</ul>
						</fieldset>
						<fieldset class="action">
							<ul>
<li class="short"><a href="#" id="register_submit" class="typcn typcn-user-add action inert" title="<?php print $lang['Register']; ?>"></a><span class="error" id="register_errors"></span></li>
							</ul>
						</fieldset>
					</form>
<br class="drop-b" />
				</div>
			</div>
			<div id="comm_scrn">
				<div id="comm_pane">
<h3>Community links</h3>
<p>additional info to getting in touch with modders, etc.</p>
				</div>
			</div>

</script>

<script id="about_page" type="text/template">
			<div id="genr_scrn">
				<div id="genr_pane">
					<h3>About Page</h3>

				</div>
			</div>
</script>

<script id="faq_page" type="text/template">
			<div id="genr_scrn">
				<div id="genr_pane">
					<h3>FAQ Page</h3>

				</div>
			</div>
</script>

<script id="privacy_page" type="text/template">
			<div id="genr_scrn">
				<div id="genr_pane">
					<h3>Privacy Policy Page</h3>

				</div>
			</div>
</script>

<script id="terms_page" type="text/template">
			<div id="genr_scrn">
				<div id="genr_pane">
					<h3>Terms of Use Page</h3>

				</div>
			</div>
</script>

<script id="guidelines_page" type="text/template">
			<div id="genr_scrn">
				<div id="genr_pane">
					<h3>Submission Guidelines Page</h3>

				</div>
			</div>
</script>

<script id="general_page" type="text/template">
			<div id="genr_scrn">
				<div id="genr_pane">
					<h3>General Display Page</h3>

				</div>
			</div>
</script>

<script id="login_widget" type="text/template">
	<form name="login" id="login_form" class="" method="POST" action="<?php print $theme['root']; ?>/api/">
		<fieldset class="input">
			<ul>
<li><input type="text" name="login_username" id="login_username" class="inert" value="" placeholder="<?php print $lang['Username']; ?>"><em title="" class="error"></em></li>
<li><input type="password" name="login_password" id="login_password" class="inert" value="" placeholder="<?php print $lang['Password']; ?>"><em title="" class="error"></em></li>
			</ul>
		</fieldset>
		<fieldset class="action">
			<ul>
<li><a href="#" id="login_reset" class="typcn typcn-delete-outline" title="<?php print $lang['Close']; ?>"></a></li>
<li><a href="#" id="login_submit" class="typcn typcn-user" title="<?php print $lang['Login']; ?>"></a></li>
			</ul>
		</fieldset>
	</form>
</script>

<script id="logout_widget" type="text/template">
<a href="<?php print $theme['root']; ?>logout" id="login_menu" class="action" title="<?php print $lang['Logout']; ?>"><?php print $lang['Logout']; ?></a>
</script>

<script id="profile_widget" type="text/template">
<a href="<?php print $theme['root']; ?>#profile/{{user}}" id="account_menu" title="<?php print $lang['Profile']; ?>"><?php print $lang['Profile']; ?></a>
</script>

<div id="wrapper" class="container">
	<div id="head_scrn">
		<div id="head_pane">

			<div id="tnav_scrn">
				<div id="tnav_pane">
					<ul>
<li><a href="<?php print $theme['root']; ?>#" id="" class="" title=""><?php print $lang['Home']; ?></a></li>
<li><a href="<?php print $theme['root']; ?>#about" id="" class="" title=""><?php print $lang['About']; ?></a></li>
<li><a href="<?php print $theme['root']; ?>#faq" id="" class="" title=""><?php print $lang['FAQ']; ?></a></li>
<li><a href="<?php print $theme['root']; ?>#contact" id="" class="" title=""><?php print $lang['Contact']; ?></a></li>
<li><a href="<?php print $theme['root']; ?>#register" id="account_menu" class="" title=""><?php print $lang['Register']; ?></a></li>
<li><a href="<?php print $theme['root']; ?>#login" id="login_menu" class="action" title=""><?php print $lang['Login']; ?></a>
	<div id="login_panel" style="display:none;">
<!-- #login_widget -->
	</div>
</li>
					</ul>
				</div>
			</div>

			<div id="titl_scrn">
				<div id="titl_pane">
<a href="<?php print $theme['root']; ?>" id="home" title="Home"><img src="<?php print $theme['images']; ?>logo2.png" width="612" height="126" /><h1>Replaceport</h1></a>
				</div>
			</div>

			<div id="logn_scrn" class="" style="display:none;">
				<div id="logn_pane">
					<form name="" id="" class="" method="" action="">
						<fieldset>
							<ul>
<li><label for=""><?php print $lang['Username']; ?></label><input type="text" name="" id="" class="short" value="" placeholder="Username"><em title="" class="error"></em></li>
<li><label for=""><?php print $lang['Password']; ?></label><input type="password" name="" id="" class="short" value="" placeholder=""><em title="" class="error"></em></li>
							</ul>
						</fieldset>
					</form>
				</div>
			</div>

			<div id="srch_scrn">
				<div id="srch_pane">
					<form name="" id="" class="" method="" action="">
						<fieldset>
							<ul>
<li><input type="text" name="" id="" class="" value="" placeholder="<?php print $lang['KeywordSearch']; ?>"><em title="" class="error"></em></li>
<li><a href="<?php print $theme['root']; ?>#search" id="search_button" class="typcn typcn-zoom action" title="<?php print $lang['Search']; ?>"></a></li>
							</ul>
						</fieldset>
					</form>
				</div>
			</div>

			<div id="catg_scrn">
				<div id="catg_pane">
<!-- #category_menu -->
				</div>
			</div>

		</div>
	</div>


	<div id="main_scrn">
		<div id="main_pane">

<!-- content placeholder here -->

		</div>
	</div>

	<div id="foot_scrn">
		<div id="foot_pane">

			<ul id="foot_menu">
<li><a href="#about" id="" class="" title="">About Us</a></li>
<li><a href="#privacy" id="" class="" title="">Privacy Policy</a></li>
<li><a href="#terms" id="" class="" title="">Terms of Use</a></li>
<li><a href="#guidelines" id="" class="" title="">Submission Guidelines</a></li>
			</ul>

<a href="#" id="copyright" class="" title="">&copy; <?php print $lang['Meta_Copyright']; ?></a>
		</div>
	</div>

</div>

</body>
</html>







