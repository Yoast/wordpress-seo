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
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Breadcrumb implements WPSEO_Graph_Piece {

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
	 * @deprecated 14.0
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Breadcrumb' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Breadcrumb::is_needed' );
		$breadcrumb = new Breadcrumb();
		$breadcrumb->context = $this->memoizer->for_current_page();
		$breadcrumb->helpers = YoastSEO()->helpers;

		return $breadcrumb->is_needed();
	}

	/**
	 * Returns Schema breadcrumb data to allow recognition of page's position in the site hierarchy.
	 *
	 * @link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool|array Array on success, false on failure.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Breadcrumb::generate' );
		$breadcrumb = new Breadcrumb();
		$breadcrumb->context = $this->memoizer->for_current_page();
		$breadcrumb->helpers = YoastSEO()->helpers;

		return $breadcrumb->generate();
	}
}
