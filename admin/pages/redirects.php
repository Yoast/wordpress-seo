<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   19.0
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

require WPSEO_PATH . 'admin/views/redirects.php';
