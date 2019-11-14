<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

use Yoast\WP\Free\Main;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Retrieves the main instance.
 *
 * @return Main The main instance.
 */
function yoast() {
	static $main;

	if ( ! $main ) {
		$main = new Main();
		$main->initialize();
	}

	return $main;
}
