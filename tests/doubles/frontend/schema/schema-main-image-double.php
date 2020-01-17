<?php

namespace Yoast\WP\SEO\Tests\Doubles\Frontend\Schema;

use WPSEO_Schema_MainImage;

/**
 * Test Helper Class.
 */
class Schema_MainImage_Double extends WPSEO_Schema_MainImage {

	/**
	 * Gets the post's first usable content image. Null if none is available.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return string|null The image URL.
	 */
	public function get_first_usable_content_image_for_post( $post_id ) {
		return parent::get_first_usable_content_image_for_post( $post_id );
	}

	/**
	 * Generates image schema from the attachment id.
	 *
	 * @param string $image_id The image schema id.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_image_schema_from_attachment_id( $image_id ) {
		return parent::generate_image_schema_from_attachment_id( $image_id );
	}

	/**
	 * Generates image schema from the url.
	 *
	 * @param string $image_id  The image schema id.
	 * @param string $image_url The image URL.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_image_schema_from_url( $image_id, $image_url ) {
		return parent::generate_image_schema_from_url( $image_id, $image_url );
	}
}
