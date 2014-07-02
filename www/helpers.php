<?php
//This is where all can help each other out.

class helpers
{
	//Pull out sensitive fields.
	public function secure($Arr_DataRow)
	{
		foreach ($Arr_DataRow as $Str_Key => $Mix_Value)
		{
			if ($Str_Key == 'id' || strpos($Str_Key, '_id') !== false)
			{
				unset($Arr_DataRow[$Str_Key]);
			}
		}

		return $Arr_DataRow;
	}

	public function mass_secure($Arr_DataRows)
	{
		$Arr_SecuredRows = array();
		foreach ($Arr_DataRows as $Arr_DataRow)
		{
			$Arr_SecuredRows[] = $this->secure($Arr_DataRow);
		}

		return $Arr_SecuredRows;
	}
	
	//Gets the index keys from the foreign_ids, to be done on projects + users before secure() is called for data linking in front end.
	public function get_data_keys($Str_Table, $Str_Field, $Arr_ForeignIds, $Obj_Database)
	{
		$Arr_Results = $Obj_Database->table($Str_Table)->where(array('id', 'in', $Arr_ForeignIds))->select();

		$Arr_Keys = array();
		foreach ($Arr_Results as $Arr_Result)
		{
			$Arr_Keys[$Arr_Result['id']] = $Arr_Result[$Str_Field];
		}

		return $Arr_Keys;
	}

	//Companion function to get_data_keys()
	public function add_data_keys($Arr_DataRows, $Arr_Keys, $Str_ForeignKey, $Str_NewKey)
	{
		foreach ($Arr_DataRows as &$Arr_DataRow)
		{
			foreach ($Arr_Keys as $Int_RowId => $Str_Value)
			{
				if ($Arr_DataRow['id'] == $Int_RowId)
				{
					$Arr_DataRow[$Str_NewKey] = $Str_Value;
				}
			}
		}

		return $Arr_DataRows;
	}

	public function get_project_ids($Arr_Keys, $Obj_Database)
	{
		$Arr_ProjectIds = array();

		//Get project ids from keys.
		$Arr_Where = array('key', 'in', $Arr_Keys);
		$Arr_Projects = $Obj_Database->table('projects')->where($Arr_Where)->select();

		$Obj_Database->table('projects');
		foreach ($Arr_Projects as $Arr_Project)
		{
			$Arr_ProjectIds[$Arr_Project[$Obj_Database->column('key')]] = $Arr_Project[$Obj_Database->column('id')];
		}

		return $Arr_ProjectIds;
	}

	//This routine will go through the obvious refactoring and optimisations once a working website is in place.
	public function populate_project_data($Arr_Project, $Obj_Database)
	{
		$Obj_Database->table('projects');
		$Arr_ProjectLink = array('project_id', 'eq', $Arr_Project[$Obj_Database->column('id')]);
		$Int_ImageId = $Arr_Project[$Obj_Database->column('image_id')]; //*!*potential bug, check for value
		$Int_ThumbId = $Arr_Project[$Obj_Database->column('thumb_id')];
		$Arr_Project = $this->secure($Obj_Database->index($Arr_Project));

		$Arr_Project['changelogs'] = $Obj_Database->table('changelogs')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('changelogs');
		foreach ($Arr_Project['changelogs'] as &$Arr_Changelog)
		{
			//Get user.
			$Arr_ChangelogUser = $Obj_Database->table('users')->where(array('id', 'eq', $Arr_Changelog[$Obj_Database->column('contributor_id')]))->limit(1)->select();

			$Obj_Database->table('changelogs');
			$Arr_Changelog = $Obj_Database->index($Arr_Changelog);
			$Arr_Changelog = $this->secure($Arr_Changelog);

			$Obj_Database->table('users');
			$Arr_Changelog['user'] = $Arr_ChangelogUser[0][$Obj_Database->column('username')];
			$Arr_Changelog['alias'] = $Arr_ChangelogUser[0][$Obj_Database->column('alias')];
		}

		$Arr_Project['dependencies'] = $Obj_Database->table('dependencies')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('dependencies');
		foreach ($Arr_Project['dependencies'] as &$Arr_Dependency)
		{
			$Arr_Dependency = $Obj_Database->index($Arr_Dependency);
			$Arr_Dependency = $this->secure($Arr_Dependency);
		}

		$Arr_Project['contributors'] = $Obj_Database->table('contributors')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Str_UserIdField = $Obj_Database->column('user_id');
		foreach ($Arr_Project['contributors'] as &$Arr_Contributor)
		{
			//Get owner
			$Arr_Users = $Obj_Database->table('users')->where(array('id', 'eq', $Arr_Contributor[$Str_UserIdField]))->select();
			if ($Arr_Contributor[$Obj_Database->table('contributors')->column('status')] == 'owner')
			{
				//*!*This is wrong, debug for correct user in where condition
				$Arr_Project['owner'] = $Arr_Users[0][$Obj_Database->table('users')->column('alias')];
				$Arr_Project['user'] = $Arr_Users[0][$Obj_Database->table('users')->column('username')];
			}

			$Obj_Database->table('contributors');
			$Arr_Contributor = $Obj_Database->index($Arr_Contributor);
			$Arr_Contributor = $this->secure($Arr_Contributor);
			$Arr_Contributor['user'] = $Arr_Users[0][$Obj_Database->table('users')->column('username')];
			$Arr_Contributor['alias'] = $Arr_Users[0][$Obj_Database->table('users')->column('alias')];
		}

		$Arr_Project['files'] = $Obj_Database->table('files')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('files');
		foreach ($Arr_Project['files'] as &$Arr_File)
		{
			//Set file to project.
			if ($Arr_File[$Obj_Database->column('id')] == $Int_ImageId)
			{
				$Arr_Project['image'] = $Arr_File[$Obj_Database->column('location')].$Arr_File[$Obj_Database->column('name')].'.'.$Arr_File[$Obj_Database->column('format')];
			}
			if ($Arr_File[$Obj_Database->column('id')] == $Int_ThumbId)
			{
				$Arr_Project['thumbnail'] = $Arr_File[$Obj_Database->column('location')].$Arr_File[$Obj_Database->column('name')].'.'.$Arr_File[$Obj_Database->column('format')];
			}

			$Arr_File[$Obj_Database->column('attributes')] = json_decode($Arr_File[$Obj_Database->column('attributes')]);
			$Arr_File = $Obj_Database->index($Arr_File);
			$Arr_File = $this->secure($Arr_File);
		}

		$Arr_Project['comments'] = $Obj_Database->table('comments')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('comments');
		foreach ($Arr_Project['comments'] as &$Arr_Comment)
		{
			//Get user.
			$Arr_CommentUser = $Obj_Database->table('users')->where(array('id', 'eq', $Arr_Comment[$Obj_Database->column('user_id')]))->limit(1)->select();

			$Obj_Database->table('comments');
			$Arr_Comment = $Obj_Database->index($Arr_Comment);
			$Arr_Comment = $this->secure($Arr_Comment);

			$Obj_Database->table('users');
			$Arr_Comment['user'] = $Arr_CommentUser[0][$Obj_Database->column('username')];
			$Arr_Comment['alias'] = $Arr_CommentUser[0][$Obj_Database->column('alias')];
		}

		$Arr_Project['watchlists'] = $Obj_Database->table('watchlists')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('watchlists');
		$Arr_Project['followers'] = 0;
		foreach ($Arr_Project['watchlists'] as &$Arr_Watchlist)
		{
			$Arr_Project['followers']++;
			$Arr_Watchlist = $Obj_Database->index($Arr_Watchlist);
			$Arr_Watchlist = $this->secure($Arr_Watchlist);
		}

		$Arr_Project['reports'] = $Obj_Database->table('reports')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('reports');
		foreach ($Arr_Project['reports'] as &$Arr_Report)
		{
			$Arr_Report = $Obj_Database->index($Arr_Report);
			$Arr_Report = $this->secure($Arr_Report);
		}

		$Arr_Project['tags'] = $Obj_Database->table('tags')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('tags');
		foreach ($Arr_Project['tags'] as &$Arr_Tag)
		{
			$Arr_Tag = $Obj_Database->index($Arr_Tag);
			$Arr_Tag = $this->secure($Arr_Tag);
		}

		$Arr_Project['downloads'] = $Obj_Database->table('downloads')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('downloads');
		$Int_TotalDownloads = 0;
		$Int_MonthlyDownloads = 0;
		foreach ($Arr_Project['downloads'] as &$Arr_Download)
		{
			$Int_TotalDownloads++;
			if (strtotime($Arr_Download[$Obj_Database->column('created')]) > strtotime('-1 month'))
			{
				$Int_MonthlyDownloads++;
			}

			$Arr_Download = $Obj_Database->index($Arr_Download);
			$Arr_Download = $this->secure($Arr_Download);
		}

		$Arr_Project['totaldownloads'] = $Int_TotalDownloads;
		$Arr_Project['monthlydownloads'] = $Int_MonthlyDownloads;

		return $Arr_Project;
	}

	public function get_projects_by_downloads($Obj_Database, $Int_Records)
	{
		//Get download rank by project.
		$Arr_Projects = array();
		$Mix_Results = $Obj_Database->table('downloads')
									->order('project_id', 'desc')
									->limit($Int_Records)
									->rank();

		//Get projects.
		if (isset($Mix_Results))
		{
			$Arr_Ids = array();
			for ($i = 0; $i < count($Mix_Results); $i++)
			{
				//Set tally to id.
				$Arr_Ids[$Mix_Results[$i][0]] = $Mix_Results[$i][1];
			}

			$Arr_Projects = $Obj_Database->table('projects')
										->where(array('id', 'in', array_keys($Arr_Ids)))
										->select();

			//Put downloads into projects.
			if ($Arr_Projects)
			{
				foreach($Arr_Projects as &$Arr_Project)
				{
					$Arr_Project['downloads'] = $Arr_Ids[$Arr_Project[$Obj_Database->column('id')]];
				}
			}
		}

		foreach ($Arr_Projects as &$Arr_Project)
		{
			$Arr_Project = $this->populate_project_data($Arr_Project, $Obj_Database);
		}

		return $Arr_Projects;
	}

	public function get_projects_by_ratings($Obj_Database, $Int_Records)
	{
		$Arr_Projects = $Obj_Database->table('projects')->order('rating', 'desc')->limit($Int_Records)->select();
		foreach ($Arr_Projects as &$Arr_Project)
		{
			$Arr_Project = $this->populate_project_data($Arr_Project, $Obj_Database);
		}

		return $Arr_Projects;
	}

	public function get_projects_by_release($Obj_Database, $Int_Records)
	{
		//Get latest release changelogs.
		$Arr_Changelogs = $Obj_Database->table('changelogs')->where(array('public', 'eq', '1'))->order('created', 'desc')->limit($Int_Records)->select();

		//Get projects ids.
		$Arr_ProjectIds = array();
		foreach ($Arr_Changelogs as $Arr_Changelog)
		{
			$Arr_ProjectIds[] = $Arr_Changelog[$Obj_Database->column('id')];
		}

		//Order results to release, could do join here.
		$Arr_Releases = $Obj_Database->table('projects')->where(array('id', 'in', $Arr_ProjectIds))->select();

		$Arr_Projects = array();
		foreach ($Arr_ProjectIds as $Int_ProjectId)
		{
			foreach ($Arr_Releases as $Arr_Release)
			{
				if ($Arr_Release[$Obj_Database->column('id')] == $Int_ProjectId)
				{
					$Arr_Projects[] = $Arr_Release;
				}
			}
		}

		foreach ($Arr_Projects as &$Arr_Project)
		{
			$Arr_Project = $this->populate_project_data($Arr_Project, $Obj_Database);
		}

		return $Arr_Projects;
	}

	public function get_projects_by_contributors($Obj_Database, $Int_Records)
	{
		//Get contributor rank by project.
		$Arr_Projects = array();
		$Mix_Results = $Obj_Database->table('contributors')
									->order('project_id', 'desc')
									->limit($Int_Records)
									->rank();

		//Get projects.
		if (isset($Mix_Results))
		{
			$Arr_Ids = array();
			for ($i = 0; $i < count($Mix_Results); $i++)
			{
				//Set tally to id.
				$Arr_Ids[$Mix_Results[$i][0]] = $Mix_Results[$i][1];
			}

			$Arr_Projects = $Obj_Database->table('projects')
										->where(array('id', 'in', array_keys($Arr_Ids)))
										->select();

			//Put contributors into projects.
			if ($Arr_Projects)
			{
				foreach($Arr_Projects as &$Arr_Project)
				{
					$Arr_Project['contributors'] = $Arr_Ids[$Arr_Project[$Obj_Database->column('id')]];
				}
			}
		}

		return $Arr_Projects;
	}

	public function get_projects_by_dependencies($Obj_Database, $Int_Records)
	{

	}

	public function get_projects_by_reports($Obj_Database, $Int_Records)
	{

	}

	public function get_projects_by_categories($Obj_Database, $Int_Records)
	{

	}

	public function get_projects_by_tags($Obj_Database, $Int_Records)
	{

	}

	public function get_projects_by_watchlists($Obj_Database, $Int_UserId)
	{
		$Arr_Projects = array();
		$Arr_UserLink = array('user_id', 'eq', $Int_UserId);
		$Mix_Results = $Obj_Database->table('watchlists')->where($Arr_UserLink)->order('created', 'asc')->select();
		$Obj_Database->table('watchlists');

		if (isset($Mix_Results))
		{
			$Arr_Ids = array();
			for ($i = 0; $i < count($Mix_Results); $i++)
			{
				$Arr_Ids[$i] = $Mix_Results[$i][$Obj_Database->column('project_id')];
			}

			$Arr_Projects = $Obj_Database->table('projects')
										->where(array('id', 'in', $Arr_Ids))
										->select();
		}

		foreach ($Arr_Projects as &$Arr_Project)
		{
			$Arr_Project = $this->populate_project_data($Arr_Project, $Obj_Database);
		}

		return $Arr_Projects;
	}

	public function get_projects_by_user($Obj_Database, $Int_UserId)
	{
		$Arr_Projects = array();
		$Arr_UserLink = array('user_id', 'eq', $Int_UserId);
		$Mix_Results = $Obj_Database->table('contributors')->where($Arr_UserLink)->order('created', 'asc')->select();
		$Obj_Database->table('contributors');

		if (isset($Mix_Results))
		{
			$Arr_Ids = array();
			for ($i = 0; $i < count($Mix_Results); $i++)
			{
				$Arr_Ids[$i] = $Mix_Results[$i][$Obj_Database->column('project_id')];
			}

			$Arr_Projects = $Obj_Database->table('projects')
										->where(array('id', 'in', $Arr_Ids))
										->select();
		}

		foreach ($Arr_Projects as &$Arr_Project)
		{
			$Arr_Project = $this->populate_project_data($Arr_Project, $Obj_Database);
		}

		return $Arr_Projects;
	}

	//Basic tree building recursion
	public function build_data_tree($Arr_DataRows, $Int_Root, $Int_ParentField, $Int_PrimaryField, $Str_ChildrenProperty)
	{
		$Arr_Tree = array();

		$Int_RootRow = false;
		foreach ($Arr_DataRows as $Arr_DataRow)
		{
			if ($Arr_DataRow[$Int_ParentField] == $Int_Root)
			{
				$Arr_TreeData = $Arr_DataRow;
				$Arr_TreeData[$Str_ChildrenProperty] = $this->build_data_tree($Arr_DataRows, $Arr_DataRow[$Int_PrimaryField], $Int_ParentField, $Int_PrimaryField, $Str_ChildrenProperty);
				$Arr_Tree[] = $Arr_TreeData;
			}
		}

		return $Arr_Tree;
	}
}
