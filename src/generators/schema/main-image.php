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
		$image_id     = $this->context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH;
		$image_schema = $this->get_image_from_indexable( $image_id );

		if ( $image_schema === null ) {
			return false;
		}

		$this->context->has_image = true;

		return $image_schema;
	}

	/**
	 * Generates the image schema based on the OpenGraph or Twitter image when it's set by the user.
	 *
	 * @param string $image_id The image schema ID.
	 *
	 * @return array|null The image schema object or null if there is no image in the content.
	 */
	private function get_image_from_indexable( $image_id ) {
		if ( isset( $this->context->indexable->open_graph_image_meta ) ) {
			return $this->helpers->schema->image->generate_from_attachment_meta( $image_id, $this->context->indexable->open_graph_image_meta );
		}

		if ( isset( $this->context->indexable->twitter_image_id ) ) {
			return $this->helpers->schema->image->generate_from_attachment_id( $image_id, $this->context->indexable->twitter_image_id );
		}

		return null;
	}
}
