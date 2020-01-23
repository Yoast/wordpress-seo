<?php
/**
 * A helper object for permalinks in the indexable table.
 *
 * @package Yoast\WP\SEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Permalink_Helper.
 *
 * Used for manipulation of the permalinks field in the Indexables table.
 */
class Permalink_Helper {

	protected $wp_query_wrapper;

	/**
	 * Permalink_Helper constructor.
	 *
	 * @param WP_Query_Wrapper   $wp_query_wrapper   The WP Query wrapper.
	 */
	public function __construct(
		WP_Query_Wrapper $wp_query_wrapper
	) {
		$this->wp_query_wrapper = $wp_query_wrapper;
	}

	public function reset_permalinks( $type ) {

	}
}
