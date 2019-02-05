<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_OpenGraph_Image
 */
class WPSEO_OpenGraph_Image {

	/**
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
		'alt'       => 'alt',
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
	 * Output the image metadata.
	 *
	 * @param array $image_meta Image meta data to output.
	 *
	 * @return void
	 */
	private function show_image_meta( $image_meta ) {
		foreach ( $this->image_tags as $key => $value ) {
			if ( ! empty( $image_meta[ $key ] ) ) {
				$this->opengraph->og_tag( 'og:image:' . $key, $image_meta[ $key ] );
			}
		}
	}

	/**
	 * Outputs an image tag based on whether it's https or not.
	 *
	 * @param string $image_url The image URL.
	 *
	 * @return void
	 */
	private function og_image_tag( $image_url ) {
		$this->opengraph->og_tag( 'og:image', esc_url( $image_url ) );

		// Add secure URL if detected. Not all services implement this, so the regular one also needs to be rendered.
		if ( strpos( $image_url, 'https://' ) === 0 ) {
			$this->opengraph->og_tag( 'og:image:secure_url', esc_url( $image_url ) );
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
	 * Adds an image by ID if possible and by URL if the ID isn't present.
	 *
	 * @param string   $image_id   The image ID as set in the database.
	 * @param string   $image_url  The saved URL for the image.
	 * @param callable $on_save_id Function to call to save the ID if it needs to be saved.
	 *
	 * @return void
	 */
	private function add_image_by_id_or_url( $image_id, $image_url, $on_save_id ) {
		switch ( $image_id ) {
			case self::EXTERNAL_IMAGE_ID:
				// Add image by URL, but skip attachment_to_id call. We already know this is an external image.
				$this->add_image( array( 'url' => $image_url ) );
				break;

			case '':
				// Add image by URL, try to save the ID afterwards. So we can use the ID the next time.
				$attachment_id = $this->add_image_by_url( $image_url );

				if ( $attachment_id !== null ) {
					call_user_func( $on_save_id, $attachment_id );
				}
				break;

			default:
				// Add the image by ID. This is our ideal scenario.
				$this->add_image_by_id( $image_id );
				break;
		}
	}

	/**
	 * Saves the ID to the frontpage Open Graph image ID.
	 *
	 * @param string $attachment_id The ID to save.
	 *
	 * @return void
	 */
	private function save_frontpage_image_id( $attachment_id ) {
		WPSEO_Options::set( 'og_frontpage_image_id', $attachment_id );
	}

	/**
	 * If the frontpage image exists, call add_image.
	 *
	 * @return void
	 */
	private function set_front_page_image() {
		if ( get_option( 'show_on_front' ) === 'page' ) {
			$this->set_user_defined_image();

			// Don't fall back to the frontpage image below, as that's not set for this situation, so we should fall back to the default image.
			return;
		}


		$frontpage_image_url = WPSEO_Options::get( 'og_frontpage_image' );
		$frontpage_image_id  = WPSEO_Options::get( 'og_frontpage_image_id' );

		$this->add_image_by_id_or_url( $frontpage_image_id, $frontpage_image_url, array( $this, 'save_frontpage_image_id' ) );
	}

	/**
	 * Get the images of the posts page.
	 *
	 * @return void
	 */
	private function set_posts_page_image() {
		$post_id = get_option( 'page_for_posts' );

		$this->set_image_post_meta( $post_id );

		if ( $this->has_images() ) {
			return;
		}

		$this->set_featured_image( $post_id );
	}

	/**
	 * Get the images of the singular post.
	 *
	 * @param null|int $post_id The post id to get the images for.
	 *
	 * @return void
	 */
	private function set_singular_image( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = $this->get_queried_object_id();
		}

		$this->set_user_defined_image( $post_id );

		if ( $this->has_images() ) {
			return;
		}

		$this->add_first_usable_content_image( get_post( $post_id ) );
	}

	/**
	 * Gets the user-defined image of the post.
	 *
	 * @param null|int $post_id The post id to get the images for.
	 *
	 * @return void
	 */
	private function set_user_defined_image( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = $this->get_queried_object_id();
		}

		$this->set_image_post_meta( $post_id );

		if ( $this->has_images() ) {
			return;
		}

		$this->set_featured_image( $post_id );
	}

	/**
	 * Saves the default image ID for Open Graph images to the database.
	 *
	 * @param string $attachment_id The ID to save.
	 *
	 * @return void
	 */
	private function save_default_image_id( $attachment_id ) {
		WPSEO_Options::set( 'og_default_image_id', $attachment_id );
	}

	/**
	 * Get default image and call add_image.
	 *
	 * @return void
	 */
	private function maybe_set_default_image() {
		if ( $this->has_images() ) {
			return;
		}

		$default_image_url = WPSEO_Options::get( 'og_default_image', '' );
		$default_image_id  = WPSEO_Options::get( 'og_default_image_id', '' );

		if ( $default_image_url === '' && $default_image_id === '' ) {
			return;
		}

		$this->add_image_by_id_or_url( $default_image_id, $default_image_url, array( $this, 'save_default_image_id' ) );
	}

	/**
	 * Saves the Open Graph image meta to the database for the current post.
	 *
	 * @param string $attachment_id The ID to save.
	 *
	 * @return void
	 */
	private function save_opengraph_image_id_meta( $attachment_id ) {
		$post_id = $this->get_queried_object_id();

		WPSEO_Meta::set_value( 'opengraph-image-id', (string) $attachment_id, $post_id );
	}

	/**
	 * If opengraph-image is set, call add_image and return true.
	 *
	 * @param int $post_id Optional post ID to use.
	 *
	 * @return void
	 */
	private function set_image_post_meta( $post_id = 0 ) {
		$image_id  = WPSEO_Meta::get_value( 'opengraph-image-id', $post_id );
		$image_url = WPSEO_Meta::get_value( 'opengraph-image', $post_id );

		$this->add_image_by_id_or_url( $image_id, $image_url, array( $this, 'save_opengraph_image_id_meta' ) );
	}

	/**
	 * Check if taxonomy has an image and add this image.
	 *
	 * @return void
	 */
	private function set_taxonomy_image() {
		$image_url = WPSEO_Taxonomy_Meta::get_meta_without_term( 'opengraph-image' );
		$this->add_image_by_url( $image_url );
	}

	/**
	 * If there is a featured image, check image size. If image size is correct, call add_image and return true.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	private function set_featured_image( $post_id ) {
		if ( has_post_thumbnail( $post_id ) ) {
			$attachment_id = get_post_thumbnail_id( $post_id );
			$this->add_image_by_id( $attachment_id );
		}
	}

	/**
	 * If this is an attachment page, call add_image with the attachment.
	 *
	 * @return void
	 */
	private function set_attachment_page_image() {
		$post_id = $this->get_queried_object_id();
		if ( wp_attachment_is_image( $post_id ) ) {
			$this->add_image_by_id( $post_id );
		}
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @param string $url The given URL.
	 *
	 * @return null|number Returns the found attachment ID if it exists. Otherwise -1. If the URL is empty we return null.
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
	 * Returns the overridden image size if it has been overridden.
	 *
	 * @return null|string The overridden image size or null.
	 */
	protected function get_overridden_image_size() {
		/**
		 * Filter: 'wpseo_opengraph_image_size' - Allow overriding the image size used
		 * for OpenGraph sharing. If this filter is used, the defined size will always be
		 * used for the og:image. The image will still be rejected if it is too small.
		 *
		 * Only use this filter if you manually want to determine the best image size
		 * for the `og:image` tag.
		 *
		 * Use the `wpseo_image_sizes` filter if you want to use our logic. That filter
		 * can be used to add an image size that needs to be taken into consideration
		 * within our own logic
		 *
		 * @api string $size Size string.
		 */
		return apply_filters( 'wpseo_opengraph_image_size', null );
	}

	/**
	 * Determines if the OpenGraph image size should overridden.
	 *
	 * @return bool Whether the size should be overridden.
	 */
	protected function is_size_overridden() {
		return $this->get_overridden_image_size() !== null;
	}

	/**
	 * Adds the possibility to short-circuit all the optimal variation logic with
	 * your own size.
	 *
	 * @param int $attachment_id The attachment ID that is used.
	 *
	 * @return void
	 */
	protected function get_overridden_image( $attachment_id ) {
		$attachment = WPSEO_Image_Utils::get_image( $attachment_id, $this->get_overridden_image_size() );

		if ( $attachment ) {
			$this->add_image( $attachment );
		}
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

	/**
	 * Sets the images based on the page type.
	 *
	 * @return void
	 */
	protected function set_images() {
		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $this );

		switch ( true ) {
			case is_front_page():
				$this->set_front_page_image();
				break;
			case is_home():
				$this->set_posts_page_image();
				break;
			case is_attachment():
				$this->set_attachment_page_image();
				break;
			case is_singular():
				$this->set_singular_image();
				break;
			case is_category():
			case is_tag():
			case is_tax():
				$this->set_taxonomy_image();
		}

		/**
		 * Filter: wpseo_add_opengraph_additional_images - Allows to add additional images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_additional_images', $this );

		$this->maybe_set_default_image();
	}

	/**
	 * Determines whether or not the wanted attachment is considered valid.
	 *
	 * @param int $attachment_id The attachment ID to get the attachment by.
	 *
	 * @return bool Whether or not the attachment is valid.
	 */
	protected function is_valid_attachment( $attachment_id ) {
		$attachment = get_post_mime_type( $attachment_id );

		if ( $attachment === false ) {
			return false;
		}

		return $this->is_valid_image_type( $attachment );
	}

	/**
	 * Determines whether the passed mime type is a valid image type.
	 *
	 * @param string $mime_type The detected mime type.
	 *
	 * @return bool Whether or not the attachment is a valid image type.
	 */
	protected function is_valid_image_type( $mime_type ) {
		return in_array( $mime_type, $this->valid_image_types, true );
	}

	/**
	 * Determines whether the passed URL is considered valid.
	 *
	 * @param string $url The URL to check.
	 *
	 * @return bool Whether or not the URL is a valid image.
	 */
	protected function is_valid_image_url( $url ) {
		if ( ! is_string( $url ) ) {
			return false;
		}

		$image_extension = $this->get_extension_from_url( $url );

		$is_valid = in_array( $image_extension, $this->valid_image_extensions, true );

		/**
		 * Filter: 'wpseo_opengraph_is_valid_image_url' - Allows extra validation for an image url.
		 *
		 * @api bool - Current validation result.
		 *
		 * @param string $url The image url to validate.
		 */
		return apply_filters( 'wpseo_opengraph_is_valid_image_url', $is_valid, $url );
	}

	/**
	 * Gets the image path from the passed URL.
	 *
	 * @param string $url The URL to get the path from.
	 *
	 * @return string The path of the image URL. Returns an empty string if URL parsing fails.
	 */
	protected function get_image_url_path( $url ) {
		return (string) wp_parse_url( $url, PHP_URL_PATH );
	}

	/**
	 * Determines the file extension of the passed URL.
	 *
	 * @param string $url The URL.
	 *
	 * @return string The extension.
	 */
	protected function get_extension_from_url( $url ) {
		$extension = '';
		$path      = $this->get_image_url_path( $url );

		if ( $path === '' ) {
			return $extension;
		}

		$parts = explode( '.', $path );

		if ( ! empty( $parts ) ) {
			$extension = end( $parts );
		}

		return $extension;
	}

	/**
	 * Gets the queried object ID.
	 *
	 * @return int The queried object ID.
	 */
	protected function get_queried_object_id() {
		return get_queried_object_id();
	}

	/**
	 * Adds the first usable attachment image from the post content.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return void
	 */
	private function add_first_usable_content_image( $post ) {
		$image_finder = new WPSEO_Content_Images();
		$images       = $image_finder->get_images( $post->ID, $post );

		if ( ! is_array( $images ) || $images === array() ) {
			return;
		}

		$image_url = reset( $images );
		if ( ! $image_url ) {
			return;
		}

		$this->add_image( array( 'url' => $image_url ) );
	}
}
