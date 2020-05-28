<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Breadcrumb;

/**
 * Returns schema Breadcrumb data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Breadcrumb extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		parent::__construct( Breadcrumb::class );
	}
}
