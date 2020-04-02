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
 * @deprecated 14.0
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
	 * @deprecated 14.0
	 */
	public function __construct() {
		// _deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Main_Image' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Main_Image::is_needed' );
		$main_image = new Main_Image();
		$main_image->context = $this->memoizer->for_current_page();
		$main_image->helpers = YoastSEO()->helpers;

		return $main_image->is_needed();
	}

	/**
	 * Adds a main image for the current URL to the schema if there is one.
	 *
	 * This can be either the featured image, or fall back to the first image in the content of the page.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return false|array $data Image Schema.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Main_Image::generate' );
		$main_image = new Main_Image();
		$main_image->context = $this->memoizer->for_current_page();
		$main_image->helpers = YoastSEO()->helpers;

		return $main_image->generate();
	}
}
