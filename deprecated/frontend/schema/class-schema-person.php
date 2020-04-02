<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Person data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Person implements WPSEO_Graph_Piece {

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_Person constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person' );
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::is_needed' );
		$person = new Person();
		$person->context = $this->memoizer->for_current_page();
		$person->helpers = YoastSEO()->helpers;

		return $person->is_needed();
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::generate' );
		$person = new Person();
		$person->context = $this->memoizer->for_current_page();
		$person->helpers = YoastSEO()->helpers;

		return $person->generate();
	}
}
