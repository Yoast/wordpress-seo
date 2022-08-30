<?php

namespace Yoast\WP\SEO\Generators\Schema;

use WP_Post;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Values\Schema\Image;

/**
 * Returns schema WebPage data.
 */
class WebPage extends Abstract_Schema_Piece {

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return ! ( $this->context->indexable->object_type === 'system-page' && $this->context->indexable->object_sub_type === '404' );
	}

	/**
	 * Returns WebPage schema data.
	 *
	 * @return array WebPage schema data.
	 */
	public function generate() {
		$data = [
			'@type'      => $this->context->schema_page_type,
			'@id'        => $this->context->main_schema_id,
			'url'        => $this->context->canonical,
			'name'       => $this->helpers->schema->html->smart_strip_tags( $this->context->title ),
			'isPartOf'   => [
				'@id' => $this->context->site_url . Schema_IDs::WEBSITE_HASH,
			],
		];

		if ( empty( $this->context->canonical ) && \is_search() ) {
			$data['url'] = $this->build_search_url();
		}

		if ( $this->helpers->current_page->is_front_page() ) {
			if ( $this->context->site_represents_reference ) {
				$data['about'] = $this->context->site_represents_reference;
			}
		}

		$this->add_images( $data );

		if ( $this->context->indexable->object_type === 'post' ) {
			$data['datePublished'] = $this->helpers->date->format( $this->context->post->post_date_gmt );
			$data['dateModified']  = $this->helpers->date->format( $this->context->post->post_modified_gmt );

			if ( $this->context->indexable->object_sub_type === 'post' ) {
				$data = $this->add_author( $data, $this->context->post );
			}
		}

		if ( ! empty( $this->context->description ) ) {
			$data['description'] = $this->helpers->schema->html->smart_strip_tags( $this->context->description );
		}

		if ( $this->add_breadcrumbs() ) {
			$data['breadcrumb'] = [
				'@id' => $this->context->canonical . Schema_IDs::BREADCRUMB_HASH,
			];
		}

		if ( ! empty( $this->context->main_entity_of_page ) ) {
			$data['mainEntity'] = $this->context->main_entity_of_page;
		}

		$data = $this->helpers->schema->language->add_piece_language( $data );
		$data = $this->add_potential_action( $data );

		return $data;
	}

	/**
	 * Adds an author property to the $data if the WebPage is not represented.
	 *
	 * @param array   $data The WebPage schema.
	 * @param WP_Post $post The post the context is representing.
	 *
	 * @return array The WebPage schema.
	 */
	public function add_author( $data, $post ) {
		if ( $this->context->site_represents === false ) {
			$data['author'] = [ '@id' => $this->helpers->schema->id->get_user_schema_id( $post->post_author, $this->context ) ];
		}

		return $data;
	}

	/**
	 * If we have an image, make it the primary image of the page.
	 *
	 * @param array $data WebPage schema data.
	 */
	public function add_images( &$data ) {
		$this->add_primary_image( $data );
		$this->add_content_images( $data['image'] );
		$this->add_social_images( $data['image'] );
	}

	/**
	 * Add the primary image to the graph.
	 *
	 * @param array $data The current graph.
	 * @return void
	 */
	protected function add_primary_image( &$data ) {
		if ( $this->context->has_image ) {
			if ( $this->context->main_image_id ) {
				$data['primaryImageOfPage'] = [ '@id' => home_url() . '#/schema/ImageObject/' . $this->context->main_image_id ];
				$data['image']              = [ [ '@id' => home_url() . '#/schema/ImageObject/' . $this->context->main_image_id ] ];
			}
			elseif ( $this->context->main_image_url ) {
				$data['primaryImageOfPage'] = [ '@id' => $this->context->main_image_url ];
				$data['image']              = [ [ '@id' => $this->context->main_image_id ] ];
			}
			$data['thumbnailUrl'] = $this->context->main_image_url;
		}
	}

	/**
	 * Get Image schema ID.
	 *
	 * @param Image $image The image to get the schema ID for.
	 * @return string The schema ID for the image.
	 */
	protected function get_image_schema_id( $image ) {
		if ( $image->has_id() ) {
			return home_url() . '#/schema/ImageObject/' . $image->get_id();
		}
		else {
			return $image->get_src();
		}
	}

	/**
	 * Check whether an image id is already in the graph.
	 *
	 * @param array  $graph The current graph.
	 * @param string $image_id The image schema ID to check.
	 * @return bool True when the image id is already in the graph.
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
	 * Maybe add an Image to the graph.
	 *
	 * @param array $graph The current graph.
	 * @param Image $image The image to add.
	 * @return void
	 */
	protected function maybe_add_image_id_to_graph( &$graph, $image ) {
		$image_id = $this->get_image_schema_id( $image );

		if ( ! $this->image_id_in_graph( $graph, $image_id ) ) {
			$graph[] = [ '@id' => $image_id ];
		}
	}

	/**
	 * Add content images to graph['image'] block.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_content_images( &$graph ) {
		$images = $this->helpers->image_helper->get_images_from_post_content( $this->context->post->post_content );

		foreach ( $images as $image ) {
			$this->maybe_add_image_id_to_graph( $graph, $image );
		}
	}

	/**
	 * Add social images to the graph['image'] block.
	 *
	 * @param array $graph The current graph.
	 * @return void
	 */
	protected function add_social_images( &$graph ) {
		foreach ( $this->context->presentation->open_graph_images as $image ) {
			if ( isset( $image['id'] ) ) {
				$this->maybe_add_image_id_to_graph( $graph, new Image( $image['url'], intval( $image['id'] ) ) );
			}
			else {
				$this->maybe_add_image_id_to_graph( $graph, new Image( $image['url'] ) );
			}
		}
		if ( isset( $this->context->presentation->twitter_image ) && ! empty( $this->context->presentation->twitter_image ) ) {
			$this->maybe_add_image_id_to_graph( $graph, new Image( $this->context->presentation->twitter_image ) );
		}
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	private function add_breadcrumbs() {
		if ( $this->context->indexable->object_type === 'system-page' && $this->context->indexable->object_sub_type === '404' ) {
			return false;
		}

		return true;
	}

	/**
	 * Adds the potential action property to the WebPage Schema piece.
	 *
	 * @param array $data The WebPage data.
	 *
	 * @return array The WebPage data with the potential action added.
	 */
	private function add_potential_action( $data ) {
		$url = $this->context->canonical;
		if ( $data['@type'] === 'CollectionPage' || ( \is_array( $data['@type'] ) && \in_array( 'CollectionPage', $data['@type'], true ) ) ) {
			return $data;
		}

		/**
		 * Filter: 'wpseo_schema_webpage_potential_action_target' - Allows filtering of the schema WebPage potentialAction target.
		 *
		 * @api array $targets The URLs for the WebPage potentialAction target.
		 */
		$targets = \apply_filters( 'wpseo_schema_webpage_potential_action_target', [ $url ] );

		$data['potentialAction'][] = [
			'@type'  => 'ReadAction',
			'target' => $targets,
		];

		return $data;
	}

	/**
	 * Creates the search URL for use when if there is no canonical.
	 *
	 * @return string Search URL.
	 */
	private function build_search_url() {
		return $this->context->site_url . '?s=' . \get_search_query();
	}
}
