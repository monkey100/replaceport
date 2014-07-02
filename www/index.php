<?php
//index.php
//Ridiculously simple server-side app for Replaceport

//Keeping global namespace clear.
bootstrap('http://127.0.0.38/', 'Australia/Sydney');

global $GLB_APP;
$GLB_APP = new app();
$GLB_APP->route()->respond();
exit;

//Easy global definitions.
function bootstrap($Str_Url, $Str_Timezone)
{
	//Server settings, maybey move these to a global scope declaration.
	define('CONST_STR_ORG_DOMAIN', 'ReplacePort');
	define('CONST_STR_ORG_EMAIL', 'replaceport@replaceport.com');

	//dir is correct, url should take the domain name
//	define('CONST_STR_URL_DOMAIN', str_replace('\\', '/', dirname($_SERVER['SCRIPT_FILENAME']).'/'));
	define('CONST_STR_URL_DOMAIN', $Str_Url);
	define('CONST_STR_DIR_DOMAIN', dirname($_SERVER['SCRIPT_FILENAME']));

	define('REG_URI',				'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$');
	define('REG_EMAIL',				"^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$");
	define('REG_SYSTEM_DATETIME',	'^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$');
	define('REG_JQUERYUI_DATETIME',	'([0-9]{2})/([0-9]{2})/([0-9]{4})( ([0-9]{2}):([0-9]{2}))*');
	define('STR_SYSTEM_DATETIME',	'Y-m-d H:i:s');

	date_default_timezone_set($Str_Timezone);
}


class app
{
	//Route location
	private $Arr_Location = array();
	//Language variables
	private $Obj_Locale = array();
	//Database access
	private $Obj_Database = null;
	//Transaction logic
	private $Obj_Actions = null;
	//User information
	private $Arr_User = false;
	//Session information
	private $Arr_Session = array();
	//Response string
	private $Str_Response = '';
	//Response type
	private $Str_Protocol = '';

	public function route()
	{
		//Connect to database.
		require_once(CONST_STR_DIR_DOMAIN.'/database.php');
		$this->Obj_Database = new database();

		//Initialise.
		session_start();
		$this->Arr_Session = (isset($_SESSION) && $_SESSION)? $_SESSION: false;
		$this->Arr_User = $this->get_user($this->Arr_Session);

		if (strtotime($this->Arr_User['expires']) > $_SERVER['REQUEST_TIME'])
		{
			$this->destroy_sesion();
		}

		//Get language.
		$Arr_Languages = array('en');
		$Str_Language = ($this->Arr_User && in_array($this->Arr_User['locale'], $Arr_Languages))? $this->Arr_User['locale']: 'en';
		require_once(CONST_STR_DIR_DOMAIN.'/locales/'.$Str_Language.'.php');
		$Str_Locale = 'Locale_'.strtoupper($Str_Language);
		$this->Obj_Locale = new $Str_Locale();

		//Prepare routing.
		$Arr_Location = $this->get_view_path($_SERVER['REQUEST_URI']);
		//$Str_Location = '/'.implode('/', $Arr_Location);

		//Assemble interface globals.
		$Arr_Vars = array(
					'user'		=> $this->Arr_User,
					'session'	=> $this->Arr_Session,
					'location'	=> $Arr_Location,
					'lang'		=> get_object_vars($this->Obj_Locale),
					'theme'		=> array(
						'root'		=> CONST_STR_URL_DOMAIN,
						'styles'	=> CONST_STR_URL_DOMAIN.'styles/',
						'scripts'	=> CONST_STR_URL_DOMAIN.'scripts/',
						'images'	=> CONST_STR_URL_DOMAIN.'images/',
						'uploads'	=> CONST_STR_URL_DOMAIN.'uploads/'));

		//Do routing.
		switch ($Arr_Location[0])
		{
			case 'api': $this->Str_Response = $this->api($Arr_Vars); $this->Str_Protocol = 'json'; break;
			case 'feed': $this->Str_Response = $this->feed($Arr_Vars); $this->Str_Protocol = 'feed'; break;
			case 'uploads': $this->Str_Response = $this->download($Arr_Vars); $this->Str_Protocol = 'zip'; break;
			case 'contact': $this->Str_Response = $this->contact($Arr_Vars); $this->Str_Protocol = 'json'; break;
			case 'logout': $this->Str_Response = $this->logout($Arr_Vars); $this->Str_Protocol = 'html'; break;
			default: $this->Str_Response = $this->page($Arr_Vars); $this->Str_Protocol = 'html'; break;
		}

		//Debrief.
		session_write_close();
		return $this;
	}

	public function respond()
	{
		//Kill request if no protocol has been assigned.
		if (!$this->Str_Protocol)
		{
			header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found"); die;
		}

		//Expire page in one hour.
		header('Expires: '.gmdate('D, d M Y H:i:s', (time() + 60 * 60)).' GMT');

		//Send headers.
		switch ($this->Str_Protocol)
		{
			case 'html': header('Content-Type: text/html; charset=iso-8859-1'); break;
			case 'feed': header('Content-Type: application/rss+xml; charset=ISO-8859-1'); break;
			case 'json': header('Content-Type: application/json'); break;
			case 'zip': header('Content-Type: application/octet-stream');
						header('Content-Disposition: attachment; filename="'.$Arr_Vars['file'].'.zip"');
						header('Content-Transfer-Encoding: binary'); break;
			case 'pdf': header('Content-type: application/pdf'); break;
			case 'txt': header('Content-Type: text/plain'); break;
			case 'xml': header('Content-Type: text/xml'); break;
			case 'css': header('Content-Type: text/css'); break;
			case 'js': header('Content-Type: text/javascript'); break;
			case 'jpg': header('Content-Type: image/jpg'); break;
			case 'jpeg': header('Content-Type: image/jpeg'); break;
			case 'png': header('Content-Type: image/png'); break;
			case 'gif': header('Content-Type: image/gif'); break;
		}

		//Output response.
		print $this->Str_Response;
	}


	//Formats directory and file strings.
	// - $Str_Path:					File path to format
	// * Return:					Formatted file path
	// * NB: This is a wrapper that deals with Windows/Linux diretory convetions
	public function path_request($Str_Path)
	{
		$Str_Path = str_replace('\\', '/', $Str_Path);

		return $Str_Path;
	}

	//Gets the requested view path from a URI string.
	// - $Str_RequestUri:		URI string to find the view path variables for
	// * Return:				The view path of the requested URI as an array
	public function get_view_path($Str_RequestUri)
	{
		$Arr_ViewPath = array();

		//Get requested file path in url.
		$Int_RequestGetVarStart = strpos($Str_RequestUri, '?');
		$Str_RequestUri = ($Int_RequestGetVarStart !== false)? substr($Str_RequestUri, 0, $Int_RequestGetVarStart): $Str_RequestUri;
		$Arr_RequestValues = explode('/', $Str_RequestUri);

		//Get view path of requested webpage.
		foreach ($Arr_RequestValues as $Str_RequestValue)
		{
			if ($Str_RequestValue)
				$Arr_ViewPath[] = $Str_RequestValue;
		}

		return $Arr_ViewPath;
	}

	public function get_user($Arr_Session)
	{
		//User can be any array with a userame index.
		if ($Arr_Session || isset($Arr_Session['username']))
		{
			$Arr_Results = $this->Obj_Database
								->table('users')
								->where(array('username', 'eq', $Arr_Session['username']))
								->limit(1)
								->select();

			if (isset($Arr_Results[0]))
			{
				return $this->Obj_Database->table('users')->index($Arr_Results[0]);
			}
		}

		return false;
	}

	//Completely kills session with cookie expiration.
	public function destroy_sesion()
	{
		$_SESSION = array();

		if (isset($_COOKIE[session_name()]))
		{
			setcookie(session_name(), '', time() - 42000, '/');
		}

		session_destroy();
	}

	//Templating.
	public function build($Str_Template, $Arr_Vars)
	{
		//Put local vars into the scope namespace.
		extract($Arr_Vars, EXTR_OVERWRITE);

		//Get execution result.
		$Str_Build = '';
		ob_start();
		include($this->path_request(CONST_STR_DIR_DOMAIN.'/'.$Str_Template.'.php'));
		$Str_Build = ob_get_contents();
		ob_end_clean();

		//Remove the vars from the scope namespace for safety.
		foreach ($Arr_Vars as $Str_Key => $Mix_Value)
		{
			unset($$Str_Key);
		}


		return $Str_Build;
	}
	
	public function feed($Arr_Vars)
	{
		//updates
		//watchlist
		//comments
	}

	public function page($Arr_Vars)
	{
		//Get the projects the user has commented, rated reported and on watchlist.

		$Str_Interface = $this->build('page', $Arr_Vars);
		return $Str_Interface;
	}

	public function download($Arr_Vars)
	{
		//Check download permission
		//Get download file information
		//Stream binary from disk
		//Registr successful download
	}

	//Simple recursion to pull out all tags from an api transaction.
	public function clean_request($Arr_Vars)
	{
		$Arr_Request = array();
		foreach ($Arr_Vars as $Str_Key => $Mix_Value)
		{
			if (!is_array($Mix_Value))
			{
				$Arr_Request[$Str_Key] = strip_tags($Mix_Value);
			}
			else
			{
				$Arr_Request[$Str_Key] = $this->clean_request($Mix_Value);
			}
		}

		return $Arr_Request;
	}

	public function api($Arr_Vars)
	{
		require_once(CONST_STR_DIR_DOMAIN.'/actions.php');
		$this->Obj_Actions = new actions();
		$Str_Response = '';

		//Transact post request data.
		if (isset($_POST) && $_POST)
		{
			//Loop through json for transactions
			$Arr_Request = $this->clean_request($_POST);
			$Arr_Response = array();
			foreach($Arr_Request as $Str_Type => &$Arr_Actions)
			{
				switch ($Str_Type)
				{
					case 'users':
						foreach ($Arr_Actions as $Str_Directive => &$Arr_Datasets)
						{
							switch ($Str_Directive)
							{
								case 'login': $Arr_Datasets = $this->Obj_Actions->login_users($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'select': $Arr_Datasets = $this->Obj_Actions->select_users($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'create': $Arr_Datasets = $this->Obj_Actions->create_users($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'update': $Arr_Datasets = $this->Obj_Actions->update_users($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'delete': $Arr_Datasets = $this->Obj_Actions->delete_users($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
							}
						}
					case 'watchlists':
						foreach ($Arr_Actions as $Str_Directive => &$Arr_Datasets)
						{
							switch ($Str_Directive)
							{
								case 'select': $Arr_Datasets = $this->Obj_Actions->select_watchlists($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'create': $Arr_Datasets = $this->Obj_Actions->create_watchlists($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'update': $Arr_Datasets = $this->Obj_Actions->update_watchlists($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
								case 'delete': $Arr_Datasets = $this->Obj_Actions->delete_watchlists($Arr_Datasets, $this->Obj_Database, $Arr_Vars); break;
							}
						}
					break;
				}
			}

			$Str_Response = json_encode($Arr_Request);

		}
		//Fetch call request data.
		elseif (isset($_GET) && $_GET)
		{
			//Get data request type.
			$Arr_Request = $this->clean_request($_GET);
			$Arr_Response = array();
			if (isset($_GET['gui']))
			{
				switch ($_GET['gui'])
				{
					case 'page'; $Arr_Response = $this->Obj_Actions->get_page_data($Arr_Request, $this->Obj_Database, $Arr_Vars); break;
					case 'search'; $Arr_Response = $this->Obj_Actions->get_search_data($Arr_Request, $this->Obj_Database, $Arr_Vars); break;
				}

				$Str_Response = json_encode($Arr_Response);
			}
		}

		return $Str_Response;
	}

	public function contact($Arr_Vars)
	{
		//Kill unposted requests.
		if (!isset($_POST))
		{
			header('Location: '.CONST_STR_ORG_DOMAIN.'#contact/');
			die;
		}

		require_once(CONST_STR_DIR_DOMAIN.'/mail.php');
		$Obj_Mail = new Mail();
		$Str_ContactName = (isset($_POST['name']))? $_POST['name']: '';
		$Str_ContactEmail = (isset($_POST['email']))? $_POST['email']: '';
		$Str_ContactBody = (isset($_POST['body']))? $_POST['body']: '';

		//Validate inputs.
		$Arr_Error = array();
		if (!$Str_ContactName)
		{
			$Arr_Error[] = $Arr_Vars['lang']['email_err_req_name'];
		}

		if (!$Str_ContactEmail)
		{
			$Arr_Error[] = $Arr_Vars['lang']['email_err_req_email'];
		}
		elseif (!$Obj_Mail->get_email_address_is_valid($Str_ContactEmail))
		{
			$Arr_Error[] = $Arr_Vars['lang']['email_err_inv_email'];
		}

		if (!$Str_ContactBody)
		{
			$Arr_Error[] = $Arr_Vars['lang']['email_err_req_body'];
		}

		//Process inputs.
		if (!$Arr_Error)
		{
			$Str_ContactBody = $Obj_Mail->format_text_input($Str_ContactBody);
			$Str_ContactBody = $Obj_Mail->generate_body_output($Str_ContactBody);
//*!*Tis function needs to be turned on for production.
			if (!$Obj_Mail->send_simple_email($Str_ContactName, $Str_ContactEmail, $Str_ContactBody))
			{
				$Arr_Error[] = $Arr_Vars['lang']['email_err_fail_send'];
			}
		}

		//Respond with confirmation.
		$Arr_Response = array(
			'name'	=> $Str_ContactName,
			'email'	=> $Str_ContactEmail,
			'body'	=> $Str_ContactBody,
			'error'	=> $Arr_Error);
		$Str_Response = json_encode($Arr_Response);

		return $Str_Response;
	}
	
	public function logout()
	{
		$this->destroy_sesion();
		header('Location: '.CONST_STR_URL_DOMAIN);
		die;
	}
}

?>