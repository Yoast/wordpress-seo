<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema image data.
 *
 * @since 11.1
 *
 * @property string $schema_id      The `@id` to use for the returned image.
 * @property array  $data           The ImageObject Schema array.
 * @property int    $attachment_id  The ID of the attachment used to generate the object.
 */
class WPSEO_Schema_Image {

	/**
	 * The `@id` to use for the returned image.
	 *
	 * @var string
	 */
	private $schema_id;

	/**
	 * The ImageObject Schema array.
	 *
	 * @var array
	 */
	private $data;

	/**
	 * The ID of the attachment used to generate the object.
	 *
	 * @var int
	 */
	private $attachment_id;

	/**
	 * WPSEO_Schema_Image constructor.
	 *
	 * @param string $schema_id The string to use in an image's `@id`.
	 */
	public function __construct( $schema_id ) {
		$this->schema_id = $schema_id;
		$this->generate_object();
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @param string $url     The image URL to base our object on.
	 * @param string $caption An optional caption.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_url( $url, $caption = '' ) {
		$attachment_id = WPSEO_Image_Utils::get_attachment_by_url( $url );
		if ( $attachment_id > 0 ) {
			return $this->generate_from_attachment_id( $attachment_id, $caption );
		}

		return $this->simple_image_object( $url, $caption );
	}

	/**
	 * Retrieve data about an image from the database and use it to generate a Schema object.
	 *
	 * @param int    $attachment_id The attachment to retrieve data from.
	 * @param string $caption       The caption string, if there is one.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_attachment_id( $attachment_id, $caption = '' ) {
		$this->attachment_id = $attachment_id;
		$this->data['url']   = wp_get_attachment_image_url( $this->attachment_id, 'full' );
		$this->add_image_size();
		$this->add_caption( $caption );

		return $this->data;
	}

	/**
	 * If we can't find $url in our database, we output a simple ImageObject.
	 *
	 * @param string $url     The image URL.
	 * @param string $caption A caption, if set.
	 *
	 * @return array $data Schema ImageObject array.
	 */
	public function simple_image_object( $url, $caption = '' ) {
		$this->data['url'] = $url;

		if ( ! empty( $caption ) ) {
			$this->data['caption'] = $caption;
		}

		return $this->data;
	}

	/**
	 * Retrieves an image's caption if set, or uses the alt tag if that's set.
	 *
	 * @param string $caption The caption string, if there is one.
	 *
	 * @return void
	 */
	private function add_caption( $caption = '' ) {
		if ( ! empty( $caption ) ) {
			$this->data['caption'] = $caption;

			return;
		}

		$caption = wp_get_attachment_caption();
		if ( ! empty( $caption ) ) {
			$this->data['caption'] = $caption;

			return;
		}

		$caption = get_post_meta( $this->attachment_id, '_wp_attachment_image_alt', true );
		if ( ! empty( $caption ) ) {
			$this->data['caption'] = $caption;
		}
	}

	/**
	 * Generates our bare bone ImageObject.
	 *
	 * @return void
	 */
	private function generate_object() {
		$this->data = [
			'@type' => 'ImageObject',
			'@id'   => $this->schema_id,
		];

		$this->data = WPSEO_Schema_Utils::add_piece_language( $this->data );
	}

	/**
	 * Adds image's width and height.
	 *
	 * @return void
	 */
	private function add_image_size() {
		$image_meta = wp_get_attachment_metadata( $this->attachment_id );
		if ( empty( $image_meta['width'] ) || empty( $image_meta['height'] ) ) {
			return;
		}
		$this->data['width']  = $image_meta['width'];
		$this->data['height'] = $image_meta['height'];
	}
}
