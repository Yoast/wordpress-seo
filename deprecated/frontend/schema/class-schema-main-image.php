<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns ImageObject schema data.
 *
 * @codeCoverageIgnore
 * @deprecated xx.x
 *
 * @since 11.5
 */
class WPSEO_Schema_MainImage implements WPSEO_Graph_Piece {

	/**
	 * Holds the Main_Image schema generator.
	 *
	 * @var Main_Image
	 */
	private $main_image;

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_WebPage constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Main_Image' );
		$this->memoizer     = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->main_image   = YoastSEO()->classes->get( Main_Image::class );
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
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Main_Image::is_needed' );
		$context = $this->memoizer->for_current_page();

		return $this->main_image->is_needed( $context );
	}

	/**
	 * Adds a main image for the current URL to the schema if there is one.
	 *
	 * This can be either the featured image, or fall back to the first image in the content of the page.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return false|array $data Image Schema.
	 */
	public function generate() {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Main_Image::generate' );
		$context = $this->memoizer->for_current_page();

		return $this->main_image->generate( $context );
	}
}
