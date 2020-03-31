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
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_WebPage implements WPSEO_Graph_Piece {

	/**
	 * Holds the WebPage schema generator.
	 *
	 * @var WebPage
	 */
	private $web_page;

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
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\WebPage' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->web_page = YoastSEO()->classes->get( WebPage::class );
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
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\WebPage::is_needed' );
		$context = $this->memoizer->for_current_page();

		return $this->web_page->is_needed( $context );
	}

	/**
	 * Returns WebPage schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return array WebPage schema data.
	 */
	public function generate() {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\WebPage::generate' );
		$context = $this->memoizer->for_current_page();

		return $this->web_page->generate( $context );
	}

	/**
	 * Adds an author property to the $data if the WebPage is not represented.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param array   $data The WebPage schema.
	 * @param WP_Post $post The post the context is representing.
	 *
	 * @return array The WebPage schema.
	 */
	public function add_author( $data, $post ) {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\WebPage::add_author' );
		$context = $this->memoizer->for_current_page();

		return $this->web_page->add_author( $data, $post, $context );
	}

	/**
	 * If we have an image, make it the primary image of the page.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param array $data WebPage schema data.
	 */
	public function add_image( &$data ) {
		// _deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\WebPage::add_image' );
		$context = $this->memoizer->for_current_page();

		$this->web_page->add_image( $data, $context );
	}
}
