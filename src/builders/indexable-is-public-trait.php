<?php
/**
 * Trait for determine the value of is_public for an indexable.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

/**
 * Represents the trait used in builders for calculating the value of is_public.
 */
trait Indexable_Is_Public_Trait {

	/**
	 * Determines the value of is_public.
	 *
	 * @param \Yoast\WP\SEO\Models\Indexable $indexable The indexable.
	 *
	 * @return bool
	 */
	protected function is_public( $indexable ) {
		if ( (int) $indexable->is_robots_noindex === 1 ) {
			return false;
		}

		return true;
	}
}
