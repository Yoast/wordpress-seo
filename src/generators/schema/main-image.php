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
	 * This can be either a social image (Open Graph or Twitter), the featured image,
	 * or fall back to the first image in the content of the page.
	 *
	 * @return false|array Image Schema.
	 */
	public function generate() {
		$image_id = $this->context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH;

		return $this->helpers->schema->image->generate_main_image( $image_id, $this->context );
	}
}
