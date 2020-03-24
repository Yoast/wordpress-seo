<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Website;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Website data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_Website implements WPSEO_Graph_Piece {

	/**
	 * Holds the Website schema generator.
	 *
	 * @var Website
	 */
	private $website;

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_Website constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Website' );

		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->website  = YoastSEO()->classes->get( Website::class );
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Website::is_needed' );

		$context = $this->memoizer->for_current_page();

		return $this->website->is_needed( $context );
	}

	/**
	 * Outputs code to allow recognition of the internal search engine.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @since 1.5.7
	 *
	 * @link  https://developers.google.com/structured-data/site-name
	 *
	 * @return array Website data blob.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Website::generate' );

		$context = $this->memoizer->for_current_page();

		return $this->website->generate( $context );
	}
}
