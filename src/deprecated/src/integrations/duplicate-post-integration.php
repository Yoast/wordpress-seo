<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Class to manage the integration with Yoast Duplicate Post.
 *
 * @deprecated 20.7
 * @codeCoverageIgnore
 */
class Duplicate_Post_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		\add_filter( 'duplicate_post_excludelist_filter', [ $this, 'exclude_zapier_meta' ] );
	}

	/**
	 * Filters out the Zapier meta when you copy a post with Yoast Duplicate Post.
	 *
	 * @param array $meta_excludelist The current excludelist of meta fields.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 *
	 * @return array The updated excludelist.
	 */
	public function exclude_zapier_meta( $meta_excludelist ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		$meta_excludelist[] = 'zapier_trigger_sent';
		return $meta_excludelist;
	}
}
