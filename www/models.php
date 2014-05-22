<?php
//This is where all the good looking models sip on cocktails

class users
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'username'			=> array('type'=>'VARCHAR','default'=>''),
		'password'			=> array('type'=>'VARCHAR','default'=>''),
		'email'				=> array('type'=>'VARCHAR','default'=>''),
		'alias'				=> array('type'=>'VARCHAR','default'=>''),
		'status'			=> array('type'=>'VARCHAR','default'=>'unverified'),
		'locale'			=> array('type'=>'VARCHAR','default'=>'en'),
		'expires'			=> array('type'=>'DATETIME','default'=>''),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class categories
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'parent_id'			=> array('type'=>'INT','default'=>null),
		'key'				=> array('type'=>'VARCHAR','default'=>''),
		'title'				=> array('type'=>'VARCHAR','default'=>''),
		'order'				=> array('type'=>'INT','default'=>null),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class projects
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'key'				=> array('type'=>'VARCHAR','default'=>''),
		'category_id'		=> array('type'=>'INT','default'=>null),
		'owner_id'			=> array('type'=>'INT','default'=>null),
		'image_id'			=> array('type'=>'INT','default'=>null),
		'thumb_id'			=> array('type'=>'INT','default'=>null),
		'title'				=> array('type'=>'VARCHAR','default'=>''),
		'summary'			=> array('type'=>'VARCHAR','default'=>''),
		'version'			=> array('type'=>'FLOAT','default'=>null),
		'description'		=> array('type'=>'TEXT','default'=>''),
		'comments'			=> array('type'=>'BOOL','default'=>'1'),
		'rating'			=> array('type'=>'FLOAT','default'=>'0'),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class changelogs
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'contributor_id'	=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'public'			=> array('type'=>'BOOL','default'=>'1'),
		'game_major'		=> array('type'=>'INT','default'=>null),
		'game_minor'		=> array('type'=>'INT','default'=>null),
		'game_revision'		=> array('type'=>'INT','default'=>null),
		'game_build'		=> array('type'=>'INT','default'=>null),
		'project_major'		=> array('type'=>'INT','default'=>null),
		'project_minor'		=> array('type'=>'INT','default'=>null),
		'project_revision'	=> array('type'=>'INT','default'=>null),
		'project_build'		=> array('type'=>'INT','default'=>null),
		'comment'			=> array('type'=>'TEXT','default'=>''),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class dependencies
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'changelog_id'		=> array('type'=>'INT','default'=>null),
		'require_id'		=> array('type'=>'INT','default'=>null),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class contributors
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'user_id'			=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'status'			=> array('type'=>'VARCHAR','default'=>''),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class files
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'changelog_id'		=> array('type'=>'INT','default'=>null),
		'name'				=> array('type'=>'VARCHAR','default'=>''),
		'format'			=> array('type'=>'VARCHAR','default'=>''),
		'location'			=> array('type'=>'VARCHAR','default'=>''),
		'mirror'			=> array('type'=>'VARCHAR','default'=>''),
		'size'				=> array('type'=>'INT','default'=>null),
		'attributes'		=> array('type'=>'VARCHAR','default'=>''),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class comments
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'user_id'			=> array('type'=>'INT','default'=>null),
		'comment'			=> array('type'=>'TEXT','default'=>''),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class downloads
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'file_id'			=> array('type'=>'INT','default'=>null),
		'created'			=> array('type'=>'DATETIME','default'=>''));
}

class ratings
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'user_id'			=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'value'				=> array('type'=>'INT','default'=>null),
		'created'			=> array('type'=>'DATETIME','default'=>''));
}

class watchlists
{
	public $Arr_Schema = array(
		'id'				=> array('type'=>'INT','default'=>null),
		'user_id'			=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'status'			=> array('type'=>'BOOL','default'=>'1'),
		'created'			=> array('type'=>'DATETIME','default'=>''),
		'modified'			=> array('type'=>'DATETIME','default'=>''));
}

class tags
{
	public $Arr_Schema = array(
		'id'			=> array('type'=>'INT','default'=>null),
		'project_id'	=> array('type'=>'INT','default'=>null),
		'tag'			=> array('type'=>'VARCHAR','default'=>''),
		'active'		=> array('type'=>'BOOL','default'=>'1'),
		'created'		=> array('type'=>'DATETIME','default'=>''));
}

class reports
{
	public $Arr_Schema = array(
		'id'			=> array('type'=>'INT','default'=>null),
		'user_id'		=> array('type'=>'INT','default'=>null),
		'project_id'		=> array('type'=>'INT','default'=>null),
		'comment'		=> array('type'=>'VARCHAR','default'=>''),
		'status'		=> array('type'=>'VARCHAR','default'=>''),
		'outcome'		=> array('type'=>'VARCHAR','default'=>''),
		'created'		=> array('type'=>'DATETIME','default'=>''),
		'modified'		=> array('type'=>'DATETIME','default'=>''));
}
