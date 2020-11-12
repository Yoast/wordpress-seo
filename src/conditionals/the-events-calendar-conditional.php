<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when The Events Calendar exists.
 */
class The_Events_Calendar_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return \defined( 'TRIBE_EVENTS_FILE' );
	}
}
