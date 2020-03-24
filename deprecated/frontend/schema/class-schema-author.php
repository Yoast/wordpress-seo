<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Author;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Person data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_Author implements WPSEO_Graph_Piece {

	/**
	 * Holds the author schema generator.
	 *
	 * @var Author
	 */
	private $author;

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_Author constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Author' );

		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->author   = YoastSEO()->classes->get( Author::class );
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Author::is_needed' );

		$context = $this->memoizer->for_current_page();

		return $this->author->is_needed( $context );
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Author::generate' );

		$context = $this->memoizer->for_current_page();

		return $this->author->generate( $context );
	}

	/**
	 * Gets the Schema type we use for this class.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return string[] The schema type.
	 */
	public static function get_type() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return [ 'Person' ];
	}
}
