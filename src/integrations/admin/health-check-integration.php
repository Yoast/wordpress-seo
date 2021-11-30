<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Integrations\Integration_Interface;

class Health_Check_Integration implements Integration_Interface {
	
	/**
	 * Initializes the health checks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// TODO
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * In this case: only when on an admin page.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

}