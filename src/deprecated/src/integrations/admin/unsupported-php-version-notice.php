<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Unsupported_PHP_Version_Notice.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 *
 * @deprecated 24.7
 * @codeCoverageIgnore
 */
class Unsupported_PHP_Version_Notice implements Integration_Interface {

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @deprecated 24.7
	 * @codeCoverageIgnore
	 *
	 * @return array<string> The array of conditionals.
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 24.7' );
		return [
			Yoast_Admin_And_Dashboard_Conditional::class,
		];
	}

	/**
	 * Register hooks.
	 *
	 * @deprecated 24.7
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
	 * @deprecated 24.7
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
	 * @deprecated 24.7
	 * @codeCoverageIgnore
	 *
	 * @return string The message to display.
	 */
	public function body() {
		\_deprecated_function( __METHOD__, 'WPSEO 20.4' );
		return '';
	}
}
