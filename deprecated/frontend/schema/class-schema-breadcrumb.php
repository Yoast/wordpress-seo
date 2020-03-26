<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Breadcrumb data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_Breadcrumb implements WPSEO_Graph_Piece {

	/**
	 * The new breadcrumb schema generator.
	 *
	 * @var Breadcrumb
	 */
	private $breadcrumb;

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Breadcrumb' );

		$this->breadcrumb = YoastSEO()->classes->get( Breadcrumb::class );
		$this->memoizer   = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Breadcrumb::is_needed' );
		$context = $this->memoizer->for_current_page();
		return $this->breadcrumb->is_needed( $context );
	}

	/**
	 * Returns Schema breadcrumb data to allow recognition of page's position in the site hierarchy.
	 *
	 * @link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool|array Array on success, false on failure.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Breadcrumb::generate' );
		$context = $this->memoizer->for_current_page();
		return $this->breadcrumb->generate( $context );
	}
}
