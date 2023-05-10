<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class The_Events_Calendar
 *
 * @deprecated 19.12
 * @codeCoverageIgnore
 */
class The_Events_Calendar implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
		return [ Front_End_Conditional::class, Open_Graph_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
	}

	/**
	 * Adds the events graph pieces to the schema collector.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @param array  $pieces  The current graph pieces.
	 * @param string $context The current context.
	 *
	 * @return array Extended graph pieces.
	 */
	public function add_graph_pieces( $pieces, $context ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );

		return $pieces;
	}
}
