<?php
//index.php
//Copyright - David Thomson 2008.

//Build and send requested webpage.
define('CONST_STR_DIR_DOMAIN', str_replace('\\', '/', dirname($_SERVER['SCRIPT_FILENAME']).'/'));
require_once('../litewrench/plugin.php');
process_request(configure_request());

?>