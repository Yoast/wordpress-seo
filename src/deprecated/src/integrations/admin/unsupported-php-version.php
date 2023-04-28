<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Unsupported_PHP_Version.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 *
 * @deprecated 20.4
 * @codeCoverageIgnore
 */
class Unsupported_PHP_Version implements Integration_Interface {

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'WPSEO 20.4' );
		return [
			Yoast_Admin_And_Dashboard_Conditional::class,
		];
	}

	/**
	 * Register hooks.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'WPSEO 20.4' );
	}

	/**
	 * Checks the current PHP version.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function check_php_version() {
		\_deprecated_function( __METHOD__, 'WPSEO 20.4' );
	}

	/**
	 * Composes the body of the message to display.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return string The message to display.
	 */
	public function body() {
		\_deprecated_function( __METHOD__, 'WPSEO 20.4' );
		return '';
	}
}
