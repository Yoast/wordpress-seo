<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\WebPage;

/**
 * Returns schema WebPage data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_WebPage extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * WPSEO_Schema_WebPage constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		parent::__construct( WebPage::class );

		$this->date = new WPSEO_Date_Helper();
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

		return $this->stable->add_author( $data, $post );
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

		$this->stable->add_image( $data );
	}
}
