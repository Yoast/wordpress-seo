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
	 * WPSEO_Schema_Author constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Author::__construct' );
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

		$yoast = YoastSEO();
		/**
		 * Holds a memoizer for the meta tag context.
		 *
		 * @var Meta_Tags_Context_Memoizer
		 */
		$memoizer = $yoast->classes->get( Meta_Tags_Context_Memoizer::class );
		$context  = $memoizer->for_current_page();
		/**
		 * Holds the author schema.
		 *
		 * @var Author
		 */
		$piece = $yoast->classes->get( Author::class );

		return $piece->is_needed( $context );
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Author::generate' );

		$yoast = YoastSEO();
		/**
		 * Holds a memoizer for the meta tag context.
		 *
		 * @var Meta_Tags_Context_Memoizer
		 */
		$memoizer = $yoast->classes->get( Meta_Tags_Context_Memoizer::class );
		$context  = $memoizer->for_current_page();
		/**
		 * Holds the author schema.
		 *
		 * @var Author
		 */
		$piece = $yoast->classes->get( Author::class );

		return $piece->generate( $context );
	}

	/**
	 * Gets the Schema type we use for this class.
	 *
	 * @return string[] The schema type.
	 */
	public static function get_type() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
	}
}
