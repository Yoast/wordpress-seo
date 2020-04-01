<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\FAQ;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema FAQ data.
 *
 * @deprecated 14.0
 *
 * @since 11.3
 */
class WPSEO_Schema_FAQ implements WPSEO_Graph_Piece {

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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\FAQ' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
	}

	/**
	 * If this fires, we know there's an FAQ block ont he page, so filter the page type.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array $blocks The blocks of this type on the current page.
	 */
	public function prepare_schema( $blocks ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Change the page type to an array if it isn't one, include FAQPage.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array|string $page_type The page type.
	 *
	 * @return array $page_type The page type that's now an array.
	 */
	public function change_schema_page_type( $page_type ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
		return array();
	}

	/**
	 * Render a list of questions, referencing them by ID.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\FAQ::generate' );
		$faq = new FAQ();
		$faq->context = $this->memoizer->for_current_page();
		$faq->helpers = YoastSEO()->helpers;

		return $faq->generate();
	}

	/**
	 * Add the Questions in our FAQ blocks as separate pieces to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array                 $graph   Schema data for the current page.
	 * @param WP_Block_Parser_Block $block   The block data array.
	 * @param WPSEO_Schema_Context  $context A value object with context variables.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function render_schema_questions( $graph, $block, $context ) {
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\FAQ::is_needed' );
		$faq = new FAQ();
		$faq->context = $this->memoizer->for_current_page();
		$faq->helpers = YoastSEO()->helpers;

		return $faq->is_needed();
	}
}
