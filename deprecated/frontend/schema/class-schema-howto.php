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
 * @deprecated xx.x
 *
 * @since 11.5
 */
class WPSEO_Schema_HowTo implements WPSEO_Graph_Piece {

	/**
	 * Holds the HowTo schema generator.
	 *
	 * @var HowTo
	 */
	private $how_to;

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
	 * @deprecated xx.x
	 */
	public function __construct() {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\HowTo' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->how_to   = YoastSEO()->classes->get( HowTo::class );
	}

	/**
	 * Renders a list of questions, referencing them by ID.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate() {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\HowTo::generate' );
		$context = $this->memoizer->for_current_page();

		return $this->how_to->generate( $context );
	}

	/**
	 * Renders the How-To block into our graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param array $graph Our Schema data.
	 * @param array $block The How-To block content.
	 *
	 * @return mixed
	 */
	public function render( $graph, $block ) {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x' );
		return array();
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool
	 */
	public function is_needed() {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\HowTo::is_needed' );
		$context = $this->memoizer->for_current_page();

		return $this->how_to->is_needed( $context );
	}
}
