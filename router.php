<?php

$uri = trim(strtok($_SERVER["REQUEST_URI"],'?'), '/');

if ( $uri && file_exists($_SERVER["DOCUMENT_ROOT"] . '/' . $uri) ) {
	return false;
}

require 'dist/index.html';

////if ( !isset($_GET['page']) ) {
////	$redirect = '';
////	if ( !$uri ) {
//////		$redirect = "/?page=home";
////	}
////	else {
////		$redirect = "/?page=$uri";
////	}
////	header("Location: $redirect", true, 302);
////	exit;
////}
//
//return false;