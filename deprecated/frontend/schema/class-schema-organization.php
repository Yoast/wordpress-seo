<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Organization data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_Organization implements WPSEO_Graph_Piece {

	/**
	 * Holds the Organization schema generator.
	 *
	 * @var Organization
	 */
	private $organization;

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_Organization constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Organization' );

		$this->memoizer     = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->organization = YoastSEO()->classes->get( Organization::class );
	}

	/**
	 * Determines whether an Organization graph piece should be added.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Organization::is_needed' );

		$context = $this->memoizer->for_current_page();

		return $this->organization->is_needed( $context );
	}

	/**
	 * Returns the Organization Schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return array $data The Organization schema.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Organization::generate' );

		$context = $this->memoizer->for_current_page();

		return $this->organization->generate( $context );
	}
}
