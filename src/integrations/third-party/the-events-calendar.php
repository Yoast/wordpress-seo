<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\The_Events_Calendar_Conditional;
use Yoast\WP\SEO\Generators\Schema\Third_Party\Events_Calendar_Schema;

/**
 * Class The_Events_Calendar
 */
class The_Events_Calendar implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, The_Events_Calendar_Conditional::class, Open_Graph_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_schema_graph_pieces', [ $this, 'add_graph_pieces' ], 11, 2 );
	}

	/**
	 * Adds the events graph pieces to the schema collector.
	 *
	 * @param array  $pieces  The current graph pieces.
	 * @param string $context The current context.
	 *
	 * @return array Extended graph pieces.
	 */
	public function add_graph_pieces( $pieces, $context ) {
		$pieces[] = new Events_Calendar_Schema( $context );
		return $pieces;
	}
}
