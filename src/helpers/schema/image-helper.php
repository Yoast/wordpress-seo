<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Helpers\Schema
 */

namespace Yoast\WP\Free\Helpers\Schema;

/**
 * Class Image_Helper
 *
 * @package Yoast\WP\Free\Helpers\Schema
 */
class Image_Helper {
	/**
	 * @var HTML_Helper
	 */
	private $html_helper;

	/**
	 * Image_Helper constructor.
	 *
	 * @param HTML_Helper $html_helper The HTML helper.
	 */
	public function __construct( HTML_Helper $html_helper ) {
		$this->html_helper = $html_helper;
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @param string $schema_id The `@id` to use for the returned image.
	 * @param string $url       The image URL to base our object on.
	 * @param string $caption   An optional caption.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_url( $schema_id, $url, $caption = '' ) {
		$attachment_id = \WPSEO_Image_Utils::get_attachment_by_url( $url );
		if ( $attachment_id > 0 ) {
			return $this->generate_from_attachment_id( $schema_id, $attachment_id, $caption );
		}

		return $this->simple_image_object( $schema_id, $url, $caption );
	}

	/**
	 * Retrieve data about an image from the database and use it to generate a Schema object.
	 *
	 * @param string $schema_id     The `@id` to use for the returned image.
	 * @param int    $attachment_id The attachment to retrieve data from.
	 * @param string $caption       The caption string, if there is one.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_attachment_id( $schema_id, $attachment_id, $caption = '' ) {
		$data = $this->generate_object( $schema_id );

		$data['url'] = \wp_get_attachment_image_url( $attachment_id, 'full' );
		$data        = $this->add_image_size( $data, $attachment_id );
		$data        = $this->add_caption( $data, $caption );

		return $data;
	}

	/**
	 * If we can't find $url in our database, we output a simple ImageObject.
	 *
	 * @param string $schema_id The `@id` to use for the returned image.
	 * @param string $url       The image URL.
	 * @param string $caption   A caption, if set.
	 *
	 * @return array $data Schema ImageObject array.
	 */
	public function simple_image_object( $schema_id, $url, $caption = '' ) {
		$data = $this->generate_object( $schema_id );

		$data['url'] = $url;

		if ( ! empty( $caption ) ) {
			$data['caption'] = $this->html_helper->smart_strip_tags( $caption );
		}

		return $data;
	}

	/**
	 * Retrieves an image's caption if set, or uses the alt tag if that's set.
	 *
	 * @param array  $data          An ImageObject Schema array.
	 * @param int    $attachment_id Attachment ID.
	 * @param string $caption       The caption string, if there is one.
	 *
	 * @return array An imageObject with width and height set if available.
	 */
	private function add_caption( $data, $attachment_id, $caption = '' ) {
		if ( ! empty( $caption ) ) {
			$data['caption'] = $caption;

			return $data;
		}

		$caption = \wp_get_attachment_caption( $attachment_id );
		if ( ! empty( $caption ) ) {
			$data['caption'] = $this->html_helper->smart_strip_tags( $caption );

			return $data;
		}

		$caption = \get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
		if ( ! empty( $caption ) ) {
			$data['caption'] = $this->html_helper->smart_strip_tags( $caption );
		}

		return $data;
	}

	/**
	 * Generates our bare bone ImageObject.
	 *
	 * @param string $schema_id The `@id` to use for the returned image.
	 *
	 * @return array an empty ImageObject
	 */
	private function generate_object( $schema_id ) {
		return [
			'@type' => 'ImageObject',
			'@id'   => $schema_id,
		];
	}

	/**
	 * Adds image's width and height.
	 *
	 * @param array $data          An ImageObject Schema array.
	 * @param int   $attachment_id Attachment ID.
	 *
	 * @return array An imageObject with width and height set if available.
	 */
	private function add_image_size( $data, $attachment_id ) {
		$image_meta = \wp_get_attachment_metadata( $attachment_id );
		if ( empty( $image_meta['width'] ) || empty( $image_meta['height'] ) ) {
			return;
		}
		$data['width']  = $image_meta['width'];
		$data['height'] = $image_meta['height'];

		return $data;
	}
}
