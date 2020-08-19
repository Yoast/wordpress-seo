<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\The_Events_Calendar_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class TheEventsCalendar
 */
class TheEventsCalendar implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, The_Events_Calendar_Conditional::class, Open_Graph_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
	}
}
