<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns a question object for each question in an FAQ block.
 *
 * @deprecated 14.0
 *
 * @since 11.1
 */
class WPSEO_Schema_FAQ_Questions {

	/**
	 * A value object with context variables.
	 * This property is public, because originally it was dynamically declared.
	 *
	 * @var WPSEO_Schema_Context
	 */
	public $context;

	/**
	 * WPSEO_Schema_FAQ_Questions constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array                 $data    Our schema graph.
	 * @param WP_Block_Parser_Block $block   The FAQ block of this type.
	 * @param WPSEO_Schema_Context  $context A value object with context variables.
	 */
	public function __construct( $data, $block, $context ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
		$this->context = $context;
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array The Schema with Questions added.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return [];
	}

	/**
	 * Generate a Question piece.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array $question The question to generate schema for.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function generate_question_block( $question ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return [];
	}
}
