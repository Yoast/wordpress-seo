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
	 * @param null|string     $image     Optional. The Image to use.
	 * @param WPSEO_OpenGraph $opengraph Optional. The OpenGraph object.
	 */
	public function __construct( $image = null, WPSEO_OpenGraph $opengraph = null ) {
		if ( $opengraph === null ) {
			global $wpseo_og;

			// Use the global if available.
			if ( empty( $wpseo_og ) ) {
				$wpseo_og = new WPSEO_OpenGraph();
			}

			$opengraph = $wpseo_og;
		}

		$this->opengraph = $opengraph;

		if ( ! empty( $image ) && is_string( $image ) ) {
			$this->add_image_by_url( $image );
		}

		if ( ! post_password_required() ) {
			$this->set_images();
		}
	}

	/**
	 * Outputs the images.
	 *
	 * @return void
	 */
	public function show() {
		foreach ( $this->get_images() as $image => $image_meta ) {
			$this->og_image_tag( $image );
			$this->show_image_meta( $image_meta );
		}
	}

	/**
	 * Return the images array.
	 *
	 * @return array The images.
	 */
	public function get_images() {
		return $this->images;
	}

	/**
	 * Check whether we have images or not.
	 *
	 * @return bool True if we have images, false if we don't.
	 */
	public function has_images() {
		return ! empty( $this->images );
	}

	/**
	 * Display an OpenGraph image tag.
	 *
	 * @param string|array $attachment Attachment array.
	 *
	 * @return void
	 */
	public function add_image( $attachment ) {
		// In the past `add_image` accepted an image url, so leave this for backwards compatibility.
		if ( is_string( $attachment ) ) {
			$attachment = array( 'url' => $attachment );
		}

		if ( ! is_array( $attachment ) || empty( $attachment['url'] ) ) {
			return;
		}

		// If the URL ends in `.svg`, we need to return.
		if ( ! $this->is_valid_image_url( $attachment['url'] ) ) {
			return;
		}

		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image.
		 *
		 * @api string - The URL of the OpenGraph image.
		 */
		$image_url = trim( apply_filters( 'wpseo_opengraph_image', $attachment['url'] ) );
		if ( empty( $image_url ) ) {
			return;
		}

		if ( WPSEO_Utils::is_url_relative( $image_url ) === true ) {
			$image_url = WPSEO_Image_Utils::get_relative_path( $image_url );
		}

		if ( array_key_exists( $image_url, $this->images ) ) {
			return;
		}

		$this->images[ $image_url ] = $attachment;
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @param string $url The given URL.
	 *
	 * @return null|number Returns the found attachment ID if it exists. Otherwise -1.
	 *                     If the URL is empty we return null.
	 */
	public function add_image_by_url( $url ) {
		if ( empty( $url ) ) {
			return null;
		}

		$attachment_id = WPSEO_Image_Utils::get_attachment_by_url( $url );

		if ( $attachment_id > 0 ) {
			$this->add_image_by_id( $attachment_id );
			return $attachment_id;
		}

		$this->add_image( array( 'url' => $url ) );

		return -1;
	}

	/**
	 * Adds an image to the list by attachment ID.
	 *
	 * @param int $attachment_id The attachment ID to add.
	 *
	 * @return void
	 */
	public function add_image_by_id( $attachment_id ) {
		if ( ! $this->is_valid_attachment( $attachment_id ) ) {
			return;
		}

		if ( $this->is_size_overridden() ) {
			$this->get_overridden_image( $attachment_id );
			return;
		}

		$variations = WPSEO_Image_Utils::get_variations( $attachment_id );
		$variations = WPSEO_Image_Utils::filter_usable_dimensions( $this->image_params, $variations );
		$variations = WPSEO_Image_Utils::filter_usable_file_size( $variations );

		// If we are left without variations, there is no valid variation for this attachment.
		if ( empty( $variations ) ) {
			return;
		}

		// The variations are ordered so the first variations is by definition the best one.
		$attachment = $variations[0];

		if ( $attachment ) {
			$this->add_image( $attachment );
		}
	}
}
