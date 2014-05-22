<?php
//index.php
//Landing page for LiteWrench
//Copyright - David Thomson 2008.
//Support - david@hundredthcodemonkey.net

//Build and send requested webpage.
define('MW_CONST_STR_DIR_DOMAIN', str_replace('\\', '/', dirname($_SERVER['SCRIPT_FILENAME']).'/'));
require_once('../litewrench/plugin.php');
process_request(configure_request());

?>