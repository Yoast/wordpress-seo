<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Disable_Concatenate_Scripts_Integration class
 */
class Disable_Concatenate_Scripts_Integration implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wp_print_scripts', [ $this, 'disable_concatenate_scripts' ] );
	}

	/**
	 * Due to bugs in the 5.5 core release concatenate scripts is causing errors.
	 *
	 * Because of this we disable it.
	 *
	 * @return void
	 */
	public function disable_concatenate_scripts() {
		global $concatenate_scripts;

		$concatenate_scripts = false;
	}
}
