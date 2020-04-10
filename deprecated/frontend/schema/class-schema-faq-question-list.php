<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns a question object for each question in an FAQ block.
 *
 * @since 11.1
 *
 * @deprecated 14.0
 */
class WPSEO_Schema_FAQ_Question_List {

	/**
	 * WPSEO_Schema_FAQ_Question_List constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param WP_Block_Parser_Block[] $blocks  An array of the FAQ blocks on this page.
	 * @param WPSEO_Schema_Context    $context A value object with context variables.
	 */
	public function __construct( $blocks, $context ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array The Schema with a question list added.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return [];
	}
}
