<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when The Events Calendar exists.
 */
class The_Events_Calendar_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return \defined( 'TRIBE_EVENTS_FILE' );
	}
}
