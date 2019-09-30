<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Helpers\Schema\Image_Helper;

/**
 * Returns ImageObject schema data.
 *
 * @since 11.5
 */
class MainImage extends Abstract_Schema_Piece {
	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->current_page_helper->is_simple_page() ) {
			return true;
		}

		return false;
	}

	/**
	 * Adds a main image for the current URL to the schema if there is one.
	 *
	 * This can be either the featured image, or fall back to the first image in the content of the page.
	 *
	 * @return false|array $data Image Schema.
	 */
	public function generate() {
		$image_id = $this->context->canonical . $this->id_helper->primary_image_hash;

		$image_schema = $this->get_featured_image( $this->context->id, $image_id );

		if ( $image_schema === null ) {
			$image_schema = $this->get_first_content_image( $this->context->id, $image_id );
		}

		if ( $image_schema === null ) {
			return false;
		}

		$this->context->has_image = true;

		return $image_schema;
	}

	/**
	 * Gets the image schema for the web page based on the featured image.
	 *
	 * @param int    $post_id  The post id.
	 * @param string $image_id The image schema id.
	 *
	 * @return array|null The image schema object or null if there is no featured image.
	 */
	private function get_featured_image( $post_id, $image_id ) {
		if ( ! \has_post_thumbnail( $post_id ) ) {
			return null;
		}

		return $this->generate_image_schema_from_attachment_id( $image_id );
	}

	/**
	 * Gets the image schema for the web page based on the first content image image.
	 *
	 * @param int    $post_id  The post id.
	 * @param string $image_id The image schema id.
	 *
	 * @return array|null The image schema object or null if there is no image in the content.
	 */
	private function get_first_content_image( $post_id, $image_id ) {
		$image_url = $this->get_first_usable_content_image_for_post( $post_id );

		if ( $image_url === null ) {
			return null;
		}

		return $this->generate_image_schema_from_url( $image_id, $image_url );
	}

	/**
	 * Gets the post's first usable content image. Null if none is available.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post id.
	 *
	 * @return string|null The image URL or null if there is no image.
	 */
	protected function get_first_usable_content_image_for_post( $post_id ) {
		return \WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );
	}

	/**
	 * Generates image schema from the attachment id.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $image_id The image schema id.
	 *
	 * @return array Schema ImageObject array.
	 */
	protected function generate_image_schema_from_attachment_id( $image_id ) {
		return Image_Helper::generate_from_attachment_id( $image_id, \get_post_thumbnail_id() );
	}

	/**
	 * Generates image schema from the url.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $image_id  The image schema id.
	 * @param string $image_url The image URL.
	 *
	 * @return array Schema ImageObject array.
	 */
	protected function generate_image_schema_from_url( $image_id, $image_url ) {
		return Image_Helper::generate_from_url( $image_id, $image_url );
	}
}
