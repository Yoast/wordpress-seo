<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Organization;

/**
 * Returns schema Organization data.
 *
 * @since      10.2
 * @deprecated 14.0
 */
class WPSEO_Schema_Organization extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * WPSEO_Schema_Organization constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( Organization::class );
	}
}
