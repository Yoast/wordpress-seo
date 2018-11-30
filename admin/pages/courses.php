<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   9.4.0.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( false );

echo "<div id='yoast-courses-overview'></div>";

