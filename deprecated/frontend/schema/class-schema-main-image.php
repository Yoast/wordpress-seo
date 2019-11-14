<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
	}
}
