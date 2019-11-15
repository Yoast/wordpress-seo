<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema WebPage data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_WebPage implements WPSEO_Graph_Piece {

	/**
	 * WPSEO_Schema_WebPage constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return $data;
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}
}
