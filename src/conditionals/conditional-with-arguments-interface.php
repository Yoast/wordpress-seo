<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional interface, used to prevent integrations from loading.
 */
interface Conditional_With_Arguments {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @param array ...$args The arguments.
	 *
	 * @return bool Whether or not the conditional is met.
	 */
	public function is_met( ...$args );
}
