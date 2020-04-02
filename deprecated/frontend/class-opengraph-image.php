<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

use Yoast\WP\SEO\Values\Open_Graph\Images;

_deprecated_file( basename( __FILE__ ), 'WPSEO 14.0' );

/**
 * Class WPSEO_OpenGraph_Image.
 *
 * @deprecated 14.0
 */
class WPSEO_OpenGraph_Image extends Images {

	/**
	 * The image ID used when the image is external.
	 *
	 * @var string
	 */
	const EXTERNAL_IMAGE_ID = '-1';

	/**
	 * Constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null|string     $image     Optional. The Image to use.
	 * @param WPSEO_OpenGraph $opengraph Optional. The OpenGraph object.
	 */
	public function __construct( $image = null, WPSEO_OpenGraph $opengraph = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}
}
