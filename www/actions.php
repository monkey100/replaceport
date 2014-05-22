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
			//Authorise login
			if ($Arr_Action['auth'] != $Arr_Action['username'])
			{
				$Arr_Action['error'] = $Arr_Vars['lang']['error_authorisation_match'];
			}

			//Check for user in database.
			$Arr_User = $Obj_Database->table('users')
									->where(array('username', 'eq', $Arr_Action['username']))
									->limit(1)
									->select();

			//Check session for existing login.
			if (isset($Arr_Vars['session']['username']))
			{
				if ($Arr_Vars['session']['username'] != $Arr_User['username'])
				{
					$Arr_Action['error'] = $Arr_Vars['lang']['error_different_loggedin'];
				}
				else
				{
					$Arr_Action['error'] = $Arr_Vars['lang']['error_already_loggedin'];
				}
			}

			if (!isset($Arr_Action['error']))
			{
				//Set login session.
				$_SESSION['username'] = $Arr_Action['username'];
				$_SESSION['expires'] = $Arr_Action['expires'];

				//Add response API action.
				$Arr_Action['alias'] = $Arr_User[0]['alias'];
				$Arr_Action['status'] = $Arr_User[0]['status'];
				$Arr_Action['expires'] = $Arr_User[0]['expires'];
				$Arr_Action['created'] = $Arr_User[0]['created'];
			}
		}
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
 		if (!$this->Obj_Helpers)
 		{
			require_once(MW_CONST_STR_DIR_DOMAIN.'/helpers.php');
			$this->Obj_Helpers = new helpers();
		}

		//Get most downloaded projects.
		$Arr_Vars['downloaded'] = $this->Obj_Helpers->get_projects_by_downloads($Obj_Database, 10);

		//Get highest rated projects.
		$Arr_Vars['rated'] = $this->Obj_Helpers->get_projects_by_ratings($Obj_Database, 10);

		//Get latest released projects.
		$Arr_Vars['released'] = $this->Obj_Helpers->get_projects_by_release($Obj_Database, 10);

		//Put all the data together into a response object.
print json_encode($Arr_Vars); exit;


	}

	public function get_search_data($Obj_Database)
	{

	}

}

?>