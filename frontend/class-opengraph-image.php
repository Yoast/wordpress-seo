<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_OpenGraph_Image.
 */
class WPSEO_OpenGraph_Image {

	/**
	 * The image ID used when the image is external.
	 *
	 * @var string
	 */
	const EXTERNAL_IMAGE_ID = '-1';

	/**
	 * Holds the images that have been put out as OG image.
	 *
	 * @var array
	 */
	protected $images = array();

	/**
	 * Holds the WPSEO_OpenGraph instance, so we can call og_tag.
	 *
	 * @var WPSEO_OpenGraph
	 */
	private $opengraph;

	/**
	 * Image tags that we output for each image.
	 *
	 * @var array
	 */
	private $image_tags = array(
		'width'     => 'width',
		'height'    => 'height',
		'mime-type' => 'type',
	);

	/**
	 * The parameters we have for Facebook images.
	 *
	 * @var array
	 */
	private $image_params = array(
		'min_width'  => 200,
		'max_width'  => 2000,
		'min_height' => 200,
		'max_height' => 2000,
	);

	/**
	 * Image types that are supported by OpenGraph.
	 *
	 * @var array
	 */
	private $valid_image_types = array( 'image/jpeg', 'image/gif', 'image/png' );

	/**
	 * Image extensions that are supported by OpenGraph.
	 *
	 * @var array
	 */
	private $valid_image_extensions = array( 'jpeg', 'jpg', 'gif', 'png' );

	/**
	 * Constructor.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param null|string     $image     Optional. The Image to use.
	 * @param WPSEO_OpenGraph $opengraph Optional. The OpenGraph object.
	 */
	public function __construct( $image = null, WPSEO_OpenGraph $opengraph = null ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Outputs the images.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function show() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Returns the images array.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @return array The images.
	 */
	public function get_images() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
	}

	/**
	 * Checks whether we have images or not.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @return bool True if we have images, false if we don't.
	 */
	public function has_images() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Displays an OpenGraph image tag.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param string|array $attachment Attachment array.
	 *
	 * @return void
	 */
	public function add_image( $attachment ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param string $url The given URL.
	 *
	 * @return null|number Returns the found attachment ID if it exists. Otherwise -1.
	 *                     If the URL is empty we return null.
	 */
	public function add_image_by_url( $url ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return -1;
	}

	/**
	 * Adds an image to the list by attachment ID.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param int $attachment_id The attachment ID to add.
	 *
	 * @return void
	 */
	public function add_image_by_id( $attachment_id ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}
}
