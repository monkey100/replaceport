<?php
//This is where all can help each other out.

class helpers
{
	//Pull out sensitive fields.
	public function secure($Arr_DataSet)
	{
		foreach ($Arr_DataSet as $Str_Key => $Mix_Value)
		{
			if ($Str_Key == 'id' || strpos($Str_Key, '_id') !== false)
			{
				unset($Arr_DataSet[$Str_Key]);
			}
		}

		return $Arr_DataSet;
	}

	public function populate_project_data($Arr_Project, $Obj_Database)
	{
		$Obj_Database->table('projects');
		$Arr_ProjectLink = array('project_id', 'eq', $Arr_Project[$Obj_Database->column('id')]);
		$Int_ImageId = $Arr_Project[$Obj_Database->column('image_id')]; //*!*potential bug, check for value
		$Int_ThumbId = $Arr_Project[$Obj_Database->column('thumb_id')];
		$Arr_Project = $Obj_Database->index($Arr_Project);
		$Arr_Project = $this->secure($Arr_Project);

		$Arr_Project['changelogs'] = $Obj_Database->table('changelogs')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('changelogs');
		foreach ($Arr_Project['changelogs'] as &$Arr_Changelog)
		{
			$Arr_Changelog = $Obj_Database->index($Arr_Changelog);
			$Arr_Changelog = $this->secure($Arr_Changelog);
		}

		$Arr_Project['dependencies'] = $Obj_Database->table('dependencies')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('dependencies');
		foreach ($Arr_Project['dependencies'] as &$Arr_Dependency)
		{
			$Arr_Dependency = $Obj_Database->index($Arr_Dependency);
			$Arr_Dependency = $this->secure($Arr_Dependency);
		}

		$Arr_Project['contributors'] = $Obj_Database->table('contributors')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('contributors');
		foreach ($Arr_Project['contributors'] as &$Arr_Contributor)
		{
			$Arr_Contributor = $Obj_Database->index($Arr_Contributor);
			$Arr_Contributor = $this->secure($Arr_Contributor);
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
			$Arr_Comment = $Obj_Database->index($Arr_Comment);
			$Arr_Comment = $this->secure($Arr_Comment);
		}

		$Arr_Project['watchlists'] = $Obj_Database->table('watchlists')->where($Arr_ProjectLink)->order('created', 'desc')->select();
		$Obj_Database->table('watchlists');
		foreach ($Arr_Project['watchlists'] as &$Arr_Watchlist)
		{
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

	public function get_projects_by_wishlists($Obj_Database, $Int_Records)
	{

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

}
