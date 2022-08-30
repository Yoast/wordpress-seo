<?php

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Values\Schema\Image;

/**
 * Returns ImageObject schema data for every image on the page.
 */
class Images extends Abstract_Schema_Piece {

	/**
	 * Generate image graph content.
	 *
	 * @return array The graph in array representation.
	 */
	public function generate() {
		$graph = [];

		$this->add_primary_image( $graph );
		$this->add_post_content_images( $graph );
		$this->add_social_sharing_images( $graph );

		return $graph;
	}

	/**
	 * Determines whether a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return true;
	}

	/**
	 * Add the primary image of a post to the graph.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_primary_image( &$graph ) {
		if ( $this->context->main_image_id ) {
			$schema_id                     = home_url() . '#/schema/ImageObject/' . $this->context->main_image_id;
			$generated_schema              = $this->helpers->schema->image->generate_from_attachment_id( $schema_id, $this->context->main_image_id );
			$this->context->main_image_url = $generated_schema['url'];
			$graph[]                       = $generated_schema;
		}
		elseif ( $this->context->main_image_url ) {
			$graph[] = $this->helpers->schema->image->generate_from_url( $this->context->main_image_url, $this->context->main_image_url );
		}
	}

	/**
	 * Add image schema to the graph.
	 *
	 * @param array $graph The current graph.
	 * @param Image $image The image to add schema for.
	 * @return void
	 */
	protected function maybe_add_image_schema( &$graph, $image ) {
		if ( $image->has_id() ) {
			$this->maybe_add_image_by_id( $graph, $image->get_id() );
		}
		else {
			$this->maybe_add_image_by_url( $graph, $image->get_src() );
		}
	}

	/**
	 * Add an image to the graph by using the image ID as graph ID.
	 *
	 * Note that the image is only added if it does not exist as a graph ID in the graph yet.
	 *
	 * @param array $graph The current graph.
	 * @param int   $image_id The image ID to add to the graph.
	 * @return void
	 */
	protected function maybe_add_image_by_id( &$graph, $image_id ) {
		$schema_id = home_url() . '#/schema/ImageObject/' . $image_id;

		if ( $this->image_id_in_graph( $graph, $schema_id ) ) {
			return;
		}

		$graph[] = $this->helpers->schema->image->generate_from_attachment_id( $schema_id, $image_id );
	}

	/**
	 * Add an image to the graph by using the image URL as graph ID.
	 *
	 * Note that the image is only added if it does not exist as a graph ID in the graph yet.
	 *
	 * @param array  $graph The current graph.
	 * @param string $image_url The image URL to add to the graph.
	 * @return void
	 */
	protected function maybe_add_image_by_url( &$graph, $image_url ) {
		if ( $this->image_id_in_graph( $graph, $image_url ) ) {
			return;
		}

		$graph[] = $this->helpers->schema->image->generate_from_url( $image_url, $image_url );
	}

	/**
	 * Check whether an image graph identifier is already present in the graph.
	 *
	 * @param array  $graph The current graph.
	 * @param string $image_id The graph image ID to check.
	 * @return bool Whether the image ID is present in the graph already.
	 */
	protected function image_id_in_graph( $graph, $image_id ) {
		return \in_array(
			$image_id,
			\array_map(
				function( $element ) {
					return $element['@id'];
				},
				$graph
			),
			true
		);
	}

	/**
	 * Add the social sharing images to the graph.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_social_sharing_images( &$graph ) {
		$this->add_opengraph_images( $graph );
		$this->add_twitter_image( $graph );
	}

	/**
	 * Add the opengraph images to the graph.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_opengraph_images( &$graph ) {
		foreach ( $this->context->presentation->open_graph_images as $image ) {
			if ( isset( $image['id'] ) ) {
				$this->maybe_add_image_by_id( $graph, intval( $image['id'] ) );
			}
			else {
				$this->maybe_add_image_by_url( $graph, $image['url'] );
			}
		}
	}

	/**
	 * Add the twitter image to the graph.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_twitter_image( &$graph ) {
		if ( isset( $this->context->presentation->twitter_image ) && ! empty( $this->context->presentation->twitter_image ) ) {
			$this->maybe_add_image_by_url( $graph, $this->context->presentation->twitter_image );
		}
	}

	/**
	 * Add images from the post content to the graph.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_post_content_images( &$graph ) {
		$images = $this->helpers->image_helper->get_images_from_post_content( $this->context->post->post_content );

		foreach ( $images as $image ) {
			$this->maybe_add_image_schema( $graph, $image );
		}
	}
}
