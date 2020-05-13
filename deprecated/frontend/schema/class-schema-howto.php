<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\HowTo;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns schema FAQ data.
 *
 * @deprecated 14.0
 *
 * @since 11.5
 */
class WPSEO_Schema_HowTo extends HowTo implements WPSEO_Graph_Piece {

	/**
	 * The HowTo blocks count on the current page.
	 *
	 * @var int
	 */
	private $counter = 0;

	/**
	 * WPSEO_Schema_FAQ constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo' );

		$memoizer      = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->context = $memoizer->for_current_page();
		$this->helpers = YoastSEO()->helpers;
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

		return parent::generate();
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo::add_how_to' );

		++$this->counter;
		$this->add_how_to( $graph, $block, $this->counter );

		return $graph;
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

		return parent::is_needed();
	}

	/**
	 * Determines whether we're part of an article or a webpage.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return string A reference URL.
	 */
	protected function get_main_schema_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $this->context->main_schema_id;
	}

	/**
	 * Generates the image schema from the attachment $url.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $url Attachment url.
	 *
	 * @return array Image schema.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_image_schema( $url ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo::get_image_schema' );

		return parent::get_image_schema( $url );
	}
}
