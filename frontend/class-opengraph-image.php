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
		'min_ratio'  => 1,
		'max_ratio'  => 3,
	);

	/**
	 * Constructor.
	 *
	 * @param null|string     $image           Optional. The Image to use.
	 * @param WPSEO_Opengraph $wpseo_opengraph Optional. The OpenGraph object.
	 */
	public function __construct( $image = null, WPSEO_Opengraph $wpseo_opengraph = null ) {
		if ( $wpseo_opengraph === null ) {
			$wpseo_opengraph = new WPSEO_OpenGraph();
		}

		$this->opengraph = $wpseo_opengraph;


		if ( ! empty( $image ) && is_string( $image ) ) {
			$this->add_image_by_url( $image );
		}


		$this->set_images();
	}

	/**
	 * Outputs the images.
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
	 * @return array
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
	 * @param array $attachment Attachment array.
	 *
	 * @return void
	 */
	public function add_image( $attachment ) {
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
	 * If the frontpage image exists, call add_image.
	 */
	private function set_front_page_image() {
		// If no frontpage image is found, don't add anything.
		if ( WPSEO_Options::get( 'og_frontpage_image', '' ) === '' ) {
			return;
		}

		$this->add_image_by_url( WPSEO_Options::get( 'og_frontpage_image' ) );
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
			$post_id = get_queried_object_id();
		}

		$this->set_image_post_meta( $post_id );
		if ( $this->has_images() ) {
			return;
		}

		$this->set_featured_image( $post_id );
		if ( $this->has_images() ) {
			return;
		}

		$this->add_content_images( get_post( $post_id ) );
	}

	/**
	 * Get default image and call add_image.
	 */
	private function maybe_set_default_image() {
		if ( ! $this->has_images() && WPSEO_Options::get( 'og_default_image', '' ) !== '' ) {
			$this->add_image_by_url( WPSEO_Options::get( 'og_default_image' ) );
		}
	}

	/**
	 * If opengraph-image is set, call add_image and return true.
	 *
	 * @param int $post_id Optional post ID to use.
	 */
	private function set_image_post_meta( $post_id = 0 ) {
		$image_url = WPSEO_Meta::get_value( 'opengraph-image', $post_id );
		$this->add_image_by_url( $image_url );
	}

	/**
	 * Check if taxonomy has an image and add this image.
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
		$post_id = get_queried_object_id();
		if ( wp_attachment_is_image( $post_id ) ) {
			$this->add_image_by_id( $post_id );
		}
	}

	/**
	 * Retrieve images from the post content.
	 *
	 * @param object $post The post object.
	 *
	 * @return void
	 */
	private function add_content_images( $post ) {
		$image_finder = new WPSEO_Content_Images();
		$images       = $image_finder->get_images( $post->ID, $post );

		if ( ! is_array( $images ) || $images === array() ) {
			return;
		}

		foreach ( $images as $image_url => $attachment_id ) {
			if ( $attachment_id !== 0 ) {
				$this->add_image_by_id( $attachment_id );
			}

			if ( $attachment_id === 0 ) {
				$this->add_image_by_url( $image_url );
			}
		}
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @param string $url The given URL.
	 *
	 * @return void
	 */
	protected function add_image_by_url( $url ) {
		if ( empty( $url ) ) {
			return;
		}

		$attachment_id = WPSEO_Image_Utils::get_attachment_by_url( $url );
		if ( $attachment_id > 0 ) {
			$this->add_image_by_id( $attachment_id );
			return;
		}

		$this->add_image( array( 'url' => $url ) );
	}

	/**
	 * Adds an image to the list by attachment ID.
	 *
	 * @param int $attachment_id The attachment ID to add.
	 *
	 * @return void
	 */
	protected function add_image_by_id( $attachment_id ) {
		if ( ! WPSEO_Image_Utils::has_usable_dimensions( $attachment_id, $this->image_params ) ) {
			return;
		}

		$attachment = WPSEO_Image_Utils::get_optimal_variation( $attachment_id );
		if ( $attachment ) {
			$this->add_image( $attachment );
		}
	}

	/**
	 * Sets the images based on the page type.
	 */
	private function set_images() {
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
}
