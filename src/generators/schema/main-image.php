<?php

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Returns ImageObject schema data.
 */
class Main_Image extends Abstract_Schema_Piece {

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return $this->context->indexable->object_type === 'post';
	}

	/**
	 * Adds a main image for the current URL to the schema if there is one.
	 *
	 * This can be either the featured image, or fall back to the first image in the content of the page.
	 *
	 * @return false|array $data Image Schema.
	 */
	public function generate() {
		$image_id = $this->context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH;

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

		return $this->helpers->schema->image->generate_from_attachment_id( $image_id, \get_post_thumbnail_id( $post_id ) );
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
		$image_url = $this->helpers->image->get_post_content_image( $post_id );

		if ( $image_url === '' ) {
			return null;
		}

		return $this->helpers->schema->image->generate_from_url( $image_id, $image_url );
	}
}
