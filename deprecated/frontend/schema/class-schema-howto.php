<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\HowTo;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema FAQ data.
 *
 * @deprecated 14.0
 *
 * @since 11.5
 */
class WPSEO_Schema_HowTo implements WPSEO_Graph_Piece {

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_FAQ constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct() {
		// _deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
	}

	/**
	 * Renders a list of questions, referencing them by ID.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo::generate' );
		$how_to = new HowTo();
		$how_to->context = $this->memoizer->for_current_page();
		$how_to->helpers = YoastSEO()->helpers;

		return $how_to->generate();
	}

	/**
	 * Renders the How-To block into our graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array $graph Our Schema data.
	 * @param array $block The How-To block content.
	 *
	 * @return mixed
	 */
	public function render( $graph, $block ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
		return array();
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo::is_needed' );
		$how_to = new HowTo();
		$how_to->context = $this->memoizer->for_current_page();
		$how_to->helpers = YoastSEO()->helpers;

		return $how_to->is_needed();
	}
}
