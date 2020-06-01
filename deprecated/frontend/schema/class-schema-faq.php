<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\FAQ;

/**
 * Returns schema FAQ data.
 *
 * @deprecated 14.0
 *
 * @since 11.3
 */
class WPSEO_Schema_FAQ extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * WPSEO_Schema_FAQ constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		parent::__construct( FAQ::class );
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

		if ( ! is_array( $page_type ) ) {
			$page_type = [ $page_type ];
		}
		$page_type[] = 'FAQPage';

		return $page_type;
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

		return [];
	}
}
