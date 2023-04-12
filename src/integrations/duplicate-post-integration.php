<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Class to manage the integration with Yoast Duplicate Post.
 */
class Duplicate_Post_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'duplicate_post_excludelist_filter', [ $this, 'exclude_zapier_meta' ] );
	}

	/**
	 * Filters out the Zapier meta when you copy a post with Yoast Duplicate Post.
	 *
	 * @param array $meta_excludelist The current excludelist of meta fields.
	 *
	 * @return array The updated excludelist.
	 */
	public function exclude_zapier_meta( $meta_excludelist ) {
		$meta_excludelist[] = 'zapier_trigger_sent';
		return $meta_excludelist;
	}
}
