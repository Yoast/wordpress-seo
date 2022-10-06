<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Website;

/**
 * Returns schema Website data.
 *
 * @since      10.2
 * @deprecated 14.0
 */
class WPSEO_Schema_Website extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * WPSEO_Schema_Website constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( Website::class );
	}
}
