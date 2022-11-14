<?php

namespace Yoast\WP\SEO\Generators\Schema\Third_Party;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * A class to handle textdomains and other Yoast Event Schema related logic..
 *
 * @deprecated 19.12
 * @codeCoverageIgnore
 */
class Events_Calendar_Schema extends Abstract_Schema_Piece {

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	public $context;

	/**
	 * The helpers surface
	 *
	 * @var Helpers_Surface
	 */
	public $helpers;

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_needed() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.12' );
		return false;
	}

	/**
	 * Adds our Event piece of the graph.
	 * Partially lifted from the 'Tribe__JSON_LD__Abstract' class.
	 *
	 * @see        https://docs.theeventscalendar.com/reference/classes/tribe__json_ld__abstract/
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return array Event Schema markup
	 */
	public function generate() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.12' );
		return [];
	}
}
