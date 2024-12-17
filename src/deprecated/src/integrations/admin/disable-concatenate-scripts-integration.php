<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Disable_Concatenate_Scripts_Integration class.
 *
 * @deprecated 23.2
 * @codeCoverageIgnore
 */
class Disable_Concatenate_Scripts_Integration implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * In this case: when on an admin page.
	 *
	 * @deprecated 23.2
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Registers an action to disable script concatenation.
	 *
	 * @deprecated 23.2
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.2' );
	}

	/**
	 * Due to bugs in the 5.5 core release concatenate scripts is causing errors.
	 *
	 * Because of this we disable it.
	 *
	 * @return void
	 */
	public function disable_concatenate_scripts() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.2' );
	}
}
