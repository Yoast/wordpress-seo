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
use Yoast\WP\SEO\Generators\Schema\Third_Party\EventsCalendarSchema;
use function \apply_filters;

/**
 * Class The_Events_Calendar
 */
class The_Events_Calendar implements Integration_Interface {

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
		\add_filter( 'wpseo_schema_graph_pieces', array( $this, 'add_graph_pieces' ), 11, 2 );
	}

	public function add_graph_pieces( $pieces, $context ) {
		$pieces[] = new EventsCalendarSchema( $context );
		return $pieces;
	}
}
