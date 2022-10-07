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

		$graph = $this->add_primary_image( $graph );
		$graph = $this->add_post_content_images( $graph );

		return $this->add_social_sharing_images( $graph );
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
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function add_primary_image( $graph ) {
		if ( $this->context->main_image_id ) {
			$schema_id        = $this->helpers->image->get_attachment_image_url( $this->context->main_image_id, 'full' );
			$generated_schema = $this->helpers->schema->image->generate_from_attachment_id( $schema_id, $this->context->main_image_id );
			$graph[]          = $generated_schema;
		}
		elseif ( $this->context->main_image_url ) {
			$graph[] = $this->helpers->schema->image->generate_from_url( $this->context->main_image_url, $this->context->main_image_url );
		}

		return $graph;
	}

	/**
	 * Maybe add image schema to the graph.
	 *
	 * @param array $graph The current graph.
	 * @param Image $image The image to add schema for.
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function maybe_add_image_schema( $graph, $image ) {
		if ( $this->image_id_in_graph( $graph, $image->get_src() ) ) {
			return $graph;
		}

		return $this->add_image_schema( $graph, $image );
	}

	/**
	 * Add image schema to the graph.
	 *
	 * @param array $graph The current graph.
	 * @param Image $image The image to add schema for.
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function add_image_schema( $graph, $image ) {
		if ( $image->has_id() ) {
			if ( $image->has_size() ) {
				$graph[] = $this->helpers->schema->image->generate_from_attachment_id( $image->get_src(), $image->get_id(), '', false, [ $image->get_width(), $image->get_height() ] );
			}
			else {
				$graph[] = $this->helpers->schema->image->generate_from_attachment_id( $image->get_src(), $image->get_id() );
			}
		}
		else {
			$graph[] = $this->helpers->schema->image->generate_from_url( $image->get_src(), $image->get_src() );
		}

		return $graph;
	}

	/**
	 * Check whether an image graph identifier is already present in the graph.
	 *
	 * @param array  $graph    The current graph.
	 * @param string $image_id The graph image ID to check.
	 *
	 * @return bool Whether the image ID is present in the graph already.
	 */
	protected function image_id_in_graph( $graph, $image_id ) {
		return \in_array(
			$image_id,
			\array_map(
				function ( $element ) {
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
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function add_social_sharing_images( $graph ) {
		$graph = $this->add_opengraph_images( $graph );

		return $this->add_twitter_image( $graph );
	}

	/**
	 * Add the opengraph images to the graph.
	 *
	 * @param array $graph The current graph.
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function add_opengraph_images( $graph ) {
		foreach ( $this->context->presentation->open_graph_images as $image ) {
			$image_obj = $this->helpers->schema->image->convert_open_graph_image( $image );
			$graph     = $this->maybe_add_image_schema( $graph, $image_obj );
		}

		return $graph;
	}

	/**
	 * Add the twitter image to the graph.
	 *
	 * @param array $graph The current graph.
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function add_twitter_image( $graph ) {
		if ( isset( $this->context->presentation->twitter_image ) && ! empty( $this->context->presentation->twitter_image ) ) {
			$image = new Image( $this->context->presentation->twitter_image );
			$graph = $this->maybe_add_image_schema( $graph, $image );
		}

		return $graph;
	}

	/**
	 * Add images from the post content to the graph.
	 *
	 * @param array $graph The current graph.
	 *
	 * @return array $graph The new graph with added image content.
	 */
	protected function add_post_content_images( $graph ) {
		foreach ( $this->context->images as $image ) {
			$graph = $this->maybe_add_image_schema( $graph, $image );
		}

		return $graph;
	}
}

/**
 * Class alias to make sure this class is backwards compatible.
 *
 * @deprecated 20.0 Please use new class Images.
 */
\class_alias( Images::class, '\Yoast\WP\SEO\Generators\Schema\Main_Images' );
