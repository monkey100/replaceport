<?php

class actions
{
	public $Arr_Authorise = array();
	public $Obj_Helpers = null;

	public function get_authority($Str_Username, $Obj_Database)
	{
		//Load authenticating user.
		if (!isset($this->Arr_Authorise['username']) || $this->Arr_Authorise['username'] == $Str_Username)
		{
			$Arr_Results = $Obj_Database->table('users')
								->where(array('username', 'eq', $Arr_User['username']))
								->limit(1)
								->select();

			//Set authorisation results.
			if (isset($Arr_Results[0]) && $Arr_Results[0])
			{
				$this->Arr_Authorise = $Arr_Results[0];
			}
			else
			{
				return $GLB_APP->Obj_Locale['error_user_not_found'];
			}
		}

		//Test authority.
		if (($this->Arr_Authorise['status'] == 'admin') || ($this->Arr_Authorise['status'] == 'moderator'))
		{
			return true;
		}

		return false;
	}

	//*!*On login the info goes back to the interface which does a page refreseh to set session and cookies.
	public function login_users($Arr_Datasets, $Obj_Database, $Arr_Vars)
	{
		foreach ($Arr_Datasets as $Int_Key => &$Arr_Action)
		{
			//Check data exists.
			if ((!isset($Arr_Action)) || (!$Arr_Action))
			{
				$Arr_Action = array();
				$Arr_Action['error'][] = $Arr_Vars['lang']['user_login_err_data'];
			}

			if (!isset($Arr_Action['username']) || !$Arr_Action['username'])
			{
				$Arr_Action['error'][] = $Arr_Vars['lang']['user_err_req_username'];
			}

			if (!isset($Arr_Action['password']) || !$Arr_Action['password'])
			{
				$Arr_Action['error'][] = $Arr_Vars['lang']['user_err_req_password'];
			}

			//Authorise login
			if ($Arr_Action['auth'] != $Arr_Action['username'])
			{
				$Arr_Action['error'][] = $Arr_Vars['lang']['error_authorisation_match'];
			}

			//Check for user in database.
			$Arr_User = $Obj_Database->table('users')
									->where(array('username', 'eq', $Arr_Action['username']))
									->limit(1)
									->select();

			$Obj_Database->table('users');
			if (!$Arr_User)
			{
				$Arr_Action['error'][] = $Arr_Vars['lang']['user_login_err_exists'];
			}
			else
			{
				//Check session for existing login.
				if (isset($Arr_Vars['session']['username']))
				{
					if ($Arr_Vars['session']['username'] != $Arr_User[0][$Obj_Database->column('username')])
					{
						$Arr_Action['error'][] = $Arr_Vars['lang']['user_login_err_conflict'];
					}
					else
					{
						$Arr_Action['error'][] = $Arr_Vars['lang']['user_login_err_logged'];
					}
				}
				//Otherwise check for password
				else
				{
					if (md5($Arr_Action['password']) != $Arr_User[0][$Obj_Database->column('password')])
					{
						$Arr_Action['error'][] = $Arr_Vars['lang']['user_login_err_password'];
					}
				}
			}

			if (!isset($Arr_Action['error']))
			{
				//Set login session.
				$_SESSION['username'] = $Arr_Action['username'];
				$_SESSION['expires'] = $Arr_Action['expires'];

				//Add response API action.
				$Arr_Action['alias'] = $Arr_User[0][$Obj_Database->column('alias')];
				$Arr_Action['status'] = $Arr_User[0][$Obj_Database->column('status')];
				$Arr_Action['expires'] = $Arr_User[0][$Obj_Database->column('expires')];
				$Arr_Action['created'] = $Arr_User[0][$Obj_Database->column('created')];
			}

			unset($Arr_Action['password']);
		}

		return $Arr_Datasets;
	}

	public function select_users($Arr_Datasets, $Obj_Database, $Arr_Vars)
	{
		foreach ($Arr_Datasets as $Int_Key => &$Arr_Action)
		{
			if ($this->get_authority($Arr_Action['auth'], $Obj_Database))
			{

			}
			else
			{
				
			}
		}
	}

	public function create_users($Arr_Datasets, $Obj_Database, $Arr_Vars)
	{
		foreach ($Arr_Datasets as $Int_Key => &$Arr_Action)
		{
			//Need to check the post
			//Check the session, 
				//if user is logged in and admin creat users
				//otherwise they can't have a session yet, only can make one user
				//if they have a sessio do error
		}

	}

	public function update_users($Arr_Datasets, $Obj_Database, $Arr_Vars)
	{

	}

	public function delete_users($Arr_Datasets, $Obj_Database, $Arr_Vars)
	{
		foreach ($Arr_Datasets as $Int_Key => &$Arr_Action)
		{
			if ($this->get_authority($Arr_Action['auth'], $Obj_Database))
			{

			}
			else
			{

			}
		}
	}

	public function get_page_data($Arr_Parameters, $Obj_Database, $Arr_Vars)
	{
 		//Load helpers object
 		$Arr_PageData = array();
 		if (!$this->Obj_Helpers)
 		{
			require_once(CONST_STR_DIR_DOMAIN.'/helpers.php');
			$this->Obj_Helpers = new helpers();
		}

		//Get categories, we don't need to secure them.
		$Arr_CategoryRows = $Obj_Database->table('categories')->select();
		$Obj_Database->table('categories');
		$Arr_PageData['categories'] = $this->Obj_Helpers->build_data_tree($Arr_CategoryRows, 0, $Obj_Database->column('parent_id'), $Obj_Database->column('id'), 'children');

		//Get tags.
		$Arr_Tags = $Obj_Database->table('tags')->group('tag')->order('created', 'asc')->select();
		$Arr_PageData['tags'] = $this->Obj_Helpers->mass_secure($Obj_Database->table('tags')->mass_index($Arr_Tags));

		//Get most downloaded projects.
		$Arr_PageData['downloaded'] = $this->Obj_Helpers->get_projects_by_downloads($Obj_Database, 10);

		//Get highest rated projects.
		$Arr_PageData['rated'] = $this->Obj_Helpers->get_projects_by_ratings($Obj_Database, 10);

		//Get latest released projects.
		$Arr_PageData['released'] = $this->Obj_Helpers->get_projects_by_release($Obj_Database, 10);

		//We got projects, now get the information attached to the user.
		$Arr_PageData['user'] = array();
		if (isset($Arr_Vars['user']))
		{
			//Get the raw data.
			$Arr_PageData['user'] = $Arr_Vars['user'];
			unset($Arr_PageData['user']['id']);
			unset($Arr_PageData['user']['password']);

			$Arr_UserLink = array('user_id', 'eq', $Arr_Vars['user']['id']);
			$Arr_UserProjects = $this->Obj_Helpers->get_projects_by_user($Obj_Database, $Arr_Vars['user']['id']);
			$Arr_UserComments = $Obj_Database->table('comments')->where($Arr_UserLink)->order('created', 'desc')->select();
			$Arr_UserWatchlists = $Obj_Database->table('watchlists')->where($Arr_UserLink)->order('created', 'desc')->select();
			$Arr_UserRatings = $Obj_Database->table('ratings')->where($Arr_UserLink)->order('created', 'desc')->select();
			$Arr_UserReports = $Obj_Database->table('reports')->where($Arr_UserLink)->order('created', 'desc')->select();

			//Process data.
			$Arr_PageData['user']['projects'] = $Arr_UserProjects;
			$Arr_PageData['user']['comments'] = $this->Obj_Helpers->mass_secure($Obj_Database->table('comments')->mass_index($Arr_UserProjects));
			$Arr_PageData['user']['watchlists'] = $this->Obj_Helpers->mass_secure($Obj_Database->table('watchlists')->mass_index($Arr_UserWatchlists));
			$Arr_PageData['user']['ratings'] = $this->Obj_Helpers->mass_secure($Obj_Database->table('ratings')->mass_index($Arr_UserRatings));
			$Arr_PageData['user']['reports'] = $this->Obj_Helpers->mass_secure($Obj_Database->table('reports')->mass_index($Arr_UserReports));
		}

		return $Arr_PageData;
	}

	public function get_search_data($Obj_Database)
	{

	}

}

?>