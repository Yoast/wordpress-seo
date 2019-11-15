<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema Website data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_Website implements WPSEO_Graph_Piece {

	/**
	 * WPSEO_Schema_Website constructor.
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
	}
}
