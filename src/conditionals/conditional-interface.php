<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional interface, used to prevent integrations from loading.
 */
interface Conditional {

	/**
	 * Returns whether this conditional is met.
	 *
	 * @return bool Whether the conditional is met.
	 */
	public function is_met();
}
