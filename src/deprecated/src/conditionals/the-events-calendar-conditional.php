<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when The Events Calendar exists.
 *
 * @deprecated 19.12
 * @codeCoverageIgnore
 */
class The_Events_Calendar_Conditional implements Conditional {

	/**
	 * Returns whether this conditional is met.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the conditional is met.
	 */
	public function is_met() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.12' );
		return false;
	}
}
