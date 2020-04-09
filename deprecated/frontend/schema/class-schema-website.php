<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Website;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Website data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Website extends Website implements WPSEO_Graph_Piece {

	/**
	 * WPSEO_Schema_Website constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Website' );

		$memoizer      = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->context = $memoizer->for_current_page();
		$this->helpers = YoastSEO()->helpers;
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Website::is_needed' );

		return parent::is_needed();
	}

	/**
	 * Outputs code to allow recognition of the internal search engine.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @since 1.5.7
	 *
	 * @link  https://developers.google.com/structured-data/site-name
	 *
	 * @return array Website data blob.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Website::generate' );

		return parent::generate();
	}
}
