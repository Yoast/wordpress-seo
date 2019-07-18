<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

/**
 * Conditional interface, used to prevent integrations from loading.
 *
 * @package Yoast\WP\Free\Conditionals
 */
interface Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met();
}
