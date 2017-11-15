<?php
/**
 * @package WPSEO\Admin
 * @since      1.5.0
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$license_page_manager = new WPSEO_License_Page_Manager();
$licenses_page        = $license_page_manager->get_license_page();
require WPSEO_PATH . 'admin/views/' . $licenses_page . '.php';
