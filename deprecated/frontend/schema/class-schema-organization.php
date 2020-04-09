<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Organization data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Organization extends Organization implements WPSEO_Graph_Piece {

	/**
	 * WPSEO_Schema_Organization constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Organization' );

		$memoizer      = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->context = $memoizer->for_current_page();
		$this->helpers = YoastSEO()->helpers;
	}

	/**
	 * Determines whether an Organization graph piece should be added.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Organization::is_needed' );

		return parent::is_needed();
	}

	/**
	 * Returns the Organization Schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array $data The Organization schema.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Organization::generate' );

		return parent::generate();
	}
}
