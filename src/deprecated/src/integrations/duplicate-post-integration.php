<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Class to manage the integration with Yoast Duplicate Post.
 *
 * @deprecated 23.4
 * @codeCoverageIgnore
 */
class Duplicate_Post_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 23.4
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.4' );
	}

	/**
	 * Filters out the Zapier meta when you copy a post with Yoast Duplicate Post.
	 *
	 * @deprecated 23.4
	 * @codeCoverageIgnore
	 *
	 * @param array $meta_excludelist The current excludelist of meta fields.
	 *
	 * @return array The updated excludelist.
	 */
	public function exclude_zapier_meta( $meta_excludelist ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.4' );

		return $meta_excludelist;
	}
}
