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

		if ( $this->context->main_image_id ) {
			return $this->helpers->schema->image->generate_from_attachment_id( $image_id, $this->context->main_image_id );
		}
		if ( $this->context->main_image_url ) {
			return $this->helpers->schema->image->generate_from_url( $image_id, $this->context->main_image_url );
		}

		return false;
	}
}
