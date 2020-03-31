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
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Author implements WPSEO_Graph_Piece {

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
	 * @deprecated 14.0
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::is_needed' );
		$author = new Author();
		$author->context = $this->memoizer->for_current_page();
		$author->helpers = YoastSEO()->helpers;

		return $author->is_needed();
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::generate' );
		$author = new Author();
		$author->context = $this->memoizer->for_current_page();
		$author->helpers = YoastSEO()->helpers;

		return $author->is_needed();
	}

	/**
	 * Gets the Schema type we use for this class.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return string[] The schema type.
	 */
	public static function get_type() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
		return [ 'Person' ];
	}
}
