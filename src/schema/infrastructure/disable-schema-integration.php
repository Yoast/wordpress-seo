<?php

namespace Yoast\WP\SEO\Schema\Infrastructure;

use Yoast\WP\SEO\Conditionals\Schema_Disabled_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles disabling schema.
 */
class Disable_Schema_Integration implements Integration_Interface {

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return string[]
	 */
	public static function get_conditionals() {
		return [ Schema_Disabled_Conditional::class ];
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		if ( ! \is_admin() ) {
			// No need to run this on admin pages, which would actually break some functionality in the schema settings page.
			// Specifically, in the schema settings page, we want to be able to understand whether schema has been disabled programmatically too.
			\add_filter( 'wpseo_json_ld_output', '__return_false' );
		}
	}
}
