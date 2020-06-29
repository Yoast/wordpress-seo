<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Index_Links_Conditional class
 */
class Should_Index_Links_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		/**
		 * Filter: 'wpseo_should_index_links' - Allows disabling of Yoast's links indexation.
		 *
		 * @api bool To disable the indexation, return false.
		 */
		return \apply_filters( 'wpseo_should_index_links', true );
	}
}
