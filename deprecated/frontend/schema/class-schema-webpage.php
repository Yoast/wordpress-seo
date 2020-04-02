<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\WebPage;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema WebPage data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_WebPage implements WPSEO_Graph_Piece {

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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\WebPage' );
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\WebPage::is_needed' );
		$web_page = new WebPage();
		$web_page->context = $this->memoizer->for_current_page();
		$web_page->helpers = YoastSEO()->helpers;

		return $web_page->is_needed();
	}

	/**
	 * Returns WebPage schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array WebPage schema data.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\WebPage::generate' );
		$web_page = new WebPage();
		$web_page->context = $this->memoizer->for_current_page();
		$web_page->helpers = YoastSEO()->helpers;

		return $web_page->generate();
	}

	/**
	 * Adds an author property to the $data if the WebPage is not represented.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array   $data The WebPage schema.
	 * @param WP_Post $post The post the context is representing.
	 *
	 * @return array The WebPage schema.
	 */
	public function add_author( $data, $post ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\WebPage::add_author' );
		$web_page = new WebPage();
		$web_page->context = $this->memoizer->for_current_page();
		$web_page->helpers = YoastSEO()->helpers;

		return $web_page->add_author( $data, $post );
	}

	/**
	 * If we have an image, make it the primary image of the page.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array $data WebPage schema data.
	 */
	public function add_image( &$data ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\WebPage::add_image' );
		$web_page = new WebPage();
		$web_page->context = $this->memoizer->for_current_page();
		$web_page->helpers = YoastSEO()->helpers;

		$web_page->add_image( $data );
	}
}
