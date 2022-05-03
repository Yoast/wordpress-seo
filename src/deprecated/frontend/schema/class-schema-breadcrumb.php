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
 * @since      10.2
 * @deprecated 14.0
 */
class WPSEO_Schema_Breadcrumb extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( Breadcrumb::class );
	}
}
